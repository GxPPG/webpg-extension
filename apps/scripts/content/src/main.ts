import { ChromeGetMyAttendanceInformationResponse } from "libs/api";

const BUSINESS_REPORT_DOM_SELECTOR = 'gxp-growthus-business-report';
const LOADING_TEXT = '読込中';
const ADD_BUTTON_TARGET_TABLE_SELECTOR = 'body > gxp-growthus-root > gxp-growthus-attendance-shell > div > span:nth-child(2) > gxp-growthus-business-report > table:nth-child(4)';
const WORK_TIME_FROM_WAGORA_BUTTON_ID = 'work-time-from-wagora';
const WORK_TIME_FROM_WAGORA_BUTTON_TEXT = 'Wagoraの出退勤時間を表示';
const VIEW_TIME_TARGET_ID = 'time-td';
const NOT_LEAVING_YET_TEXT = '未退勤';

/**
 * WagoraのGraphQLのエラーレスポンスを受け取った場合 | 想定外
 * throw Error
 * 
 * 指定した日に出退勤情報無し
 * return null
 * 
 * 指定した日に出退勤情報あり
 * return { begin: string, leaving: string }
 * 
 * 指定した日に出退勤情報あり、未退勤
 * reutrn { begin: string, leaving: null }
 */
const getAttendanceTimeFromWagora: (date: string) => Promise<{ begin: string, leaving: string | null } | null> = async (date: string) => {
    const response: ChromeGetMyAttendanceInformationResponse = await chrome.runtime.sendMessage({ date: date });

    if (response.status === 'error') {
        // Wagoraのタブが無かったりログインができていなかったりした場合のcause
        // [
        //     {
        //         "message": "authentication error",
        //         "locations": [],
        //         "path": null,
        //         "extensions": {
        //             "errorType": "UNAUTHENTICATED"
        //         },
        //         "errorType": null
        //     }
        // ]
        //
        // NetworkErrorのcause（background側ではエラーを拾えているが何故かこっち側に届くのは空オブジェクト）
        // {}
        console.error(response.cause);
        throw new Error();
    }

    const userAttendanceInformation = response.data.myAttendanceInformation.userAttendanceInformation;
    if (userAttendanceInformation.length === 0) {
        // 正常な日付を指定した時点でここに到達することはない想定
        throw new Error();
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const attendanceTime = userAttendanceInformation[0]!.attendanceTime;
    if (attendanceTime.length === 0) {
        // 指定した日に出退勤情報無し
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const begin = attendanceTime[0]!.begin;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const leaving = attendanceTime[attendanceTime.length - 1]!.leaving;

    return { begin: begin, leaving: leaving };
}

/**
 * 時間表示用
 */
function strfTime(date: Date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

function view(text: string) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.querySelector(`#${VIEW_TIME_TARGET_ID}`)!.textContent = text;
}

window.addEventListener("load", () => {
    let oldUrl = window.location.href;

    // domの変更を検知する
    const observer = new MutationObserver(() => {
        if (window.location.href === oldUrl) return;
        // URLの変更もあった場合のみボタンを追加
        oldUrl = window.location.href;
        // console.log('changed', window.location.href.split('/').pop());
        addButton();
    });

    observer.observe(document.body, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true,
    });

    function addButton() {
        if (document.querySelector(`#${WORK_TIME_FROM_WAGORA_BUTTON_ID}`)) {
            // ボタンがすでにある場合は追加しない
            return;
        }
        const interval = window.setInterval(() => {
            const target = document.querySelector(BUSINESS_REPORT_DOM_SELECTOR);
            const hasLoadingText = target?.innerHTML.includes(LOADING_TEXT);
            if (!hasLoadingText) {
                window.clearInterval(interval);

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const date = window.location.href.split('/').pop()!;
                const date_converted = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;

                const table = document.querySelector(ADD_BUTTON_TARGET_TABLE_SELECTOR);

                const thead_tr = table?.querySelector('thead > tr');

                thead_tr?.appendChild(document.createElement('th'));
                thead_tr?.appendChild(document.createElement('th'));

                const tbody = table?.querySelector('tbody');
                const button_td = document.createElement('td');

                button_td.innerHTML = `<button id="${WORK_TIME_FROM_WAGORA_BUTTON_ID}" sharedngxuibutton>${WORK_TIME_FROM_WAGORA_BUTTON_TEXT}</button>`;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                button_td.querySelector('button')!.onclick = () => {
                    getAttendanceTimeFromWagora(date_converted).then(res => {
                        if (res === null) {
                            view(`${date_converted}の出退勤情報はありません。`);
                            return;
                        }
                        const begin_str = strfTime(new Date(res.begin));
                        const leaving_str = res.leaving ? strfTime(new Date(res.leaving)) : NOT_LEAVING_YET_TEXT;

                        view(`${begin_str}~${leaving_str}`);
                    }).catch(() => {
                        // ※要検討
                        // ログイン状態とネットワークを確認してほしい旨を書こうとしたがメッセージが長くなりすぎるため削った
                        view('GxWagoraから出退勤情報の取得に失敗しました。')
                    });
                };

                tbody?.appendChild(button_td);

                const time_td = document.createElement('td');
                time_td.id = VIEW_TIME_TARGET_ID;
                tbody?.appendChild(time_td);
            }
        }, 100);
    }

    addButton();
});


