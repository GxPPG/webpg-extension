import { ChromeGetMyAttendanceInformationResponse, WagoraGetMyAttendanceInformationResponse } from "libs/api";

chrome.runtime.onMessage.addListener(
    function (request, _sender, sendResponse: (response?: ChromeGetMyAttendanceInformationResponse) => void) {
        fetch('https://g.gxwagora.jp/graphql', {
            method: 'POST',
            body: JSON.stringify({
                /**
                 * query getMyAttendanceInformation($from: Date!, $to: Date!) {
                 *   myAttendanceInformation(from: $from, to: $to) {
                 *     averageWorkTimeHours
                 *     userAttendanceInformation {
                 *       date
                 *       attendanceTime {
                 *         begin
                 *         leaving
                 *         __typename
                 *       }
                 *       signTime {
                 *         begin
                 *         leaving
                 *         signType
                 *         __typename
                 *       }
                 *       retrospectiveComment
                 *       __typename
                 *     }
                 *     __typename
                 *   }
                 * }
                 */
                query: 'query getMyAttendanceInformation($from: Date!, $to: Date!) {\n  myAttendanceInformation(from: $from, to: $to) {\n    averageWorkTimeHours\n    userAttendanceInformation {\n      date\n      attendanceTime {\n        begin\n        leaving\n        __typename\n      }\n      signTime {\n        begin\n        leaving\n        signType\n        __typename\n      }\n      retrospectiveComment\n      __typename\n    }\n    __typename\n  }\n}\n',
                // "operationName": "getTeamByKey",
                variables: {
                    from: request.date,
                    to: request.date
                }
            }),
        }).then(res => {
            /**
             * GraphQLのレスポンス
             * `status: 200` で errors: Array が存在する場合はエラー
             * erorrsが存在しなければ成功
             */
            res.json().then((json: WagoraGetMyAttendanceInformationResponse) => {
                if (json.errors) {
                    sendResponse({
                        status: 'error',
                        cause: json.errors,
                    });
                } else {
                    sendResponse({
                        status: 'success',
                        data: json.data,
                    });
                }
            });
        }).catch(err => {
            console.log({ err });
            sendResponse({
                status: 'error',
                cause: err,
            });
        });
        return true;
    }
);