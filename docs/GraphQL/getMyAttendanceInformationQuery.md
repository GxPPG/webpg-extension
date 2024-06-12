# getMyAttendanceInformation

リクエスト形式。  
`from, to` は `yyyy-mm-dd` 形式の文字列。  
今回はfrom, toに同じ日付を指定してその日の出退勤情報を取得する。

```graphql
query getMyAttendanceInformation($from: Date!, $to: Date!) {
  myAttendanceInformation(from: $from, to: $to) {
    averageWorkTimeHours
    userAttendanceInformation {
      date
      attendanceTime {
        begin
        leaving
        __typename
      }
      signTime {
        begin
        leaving
        signType
        __typename
      }
      retrospectiveComment
      __typename
    }
    __typename
  }
}
```

基本形レスポンス。  
リクエストのfrom, toを同じ日時にしている限りは `userAttendanceInformation` は1要素になる。  
出退勤情報があれば `attendanceTime` の配列に情報が格納される。 `begin` が出勤時間、 `leaving` が退勤時間（退勤していない場合はnull）となる。

```json
{
    "data": {
        "myAttendanceInformation": {
            "averageWorkTimeHours": 0,
            "userAttendanceInformation": [
                {
                    "date": "2024-06-04",
                    "attendanceTime": [
                        {
                            "begin": "2024-06-04T10:04:08.106381+09:00",
                            "leaving": null,
                            "__typename": "AttendanceTimeModel"
                        }
                    ],
                    "signTime": [
                        {
                            "begin": "2024-06-04T12:44:24.517602+09:00",
                            "leaving": "2024-06-04T13:46:19.679714+09:00",
                            "signType": "rest",
                            "__typename": "SignTimeModel"
                        }
                    ],
                    "retrospectiveComment": "",
                    "__typename": "UserDailyAttendanceInformationModel"
                }
            ],
            "__typename": "UserWeeklyAttendanceInformationModel"
        }
    }
}
```

同じ日に複数回出退勤した場合。 `attendanceTime` が複数要素になる。  
未退勤であれば最後の要素の `leaving` が `null` になる。

```json
{
  "averageWorkTimeHours": 5.7,
  "userAttendanceInformation": [
      {
          "date": "2024-06-11",
          "attendanceTime": [
              {
                  "begin": "2024-06-11T09:59:14.69908+09:00", // 出勤
                  "leaving": "2024-06-11T16:39:06.132624+09:00", // 退勤
                  "__typename": "AttendanceTimeModel"
              },
              {
                  "begin": "2024-06-11T16:39:11.039632+09:00", // 出勤
                  "leaving": "2024-06-11T16:39:19.088145+09:00", // 退勤
                  "__typename": "AttendanceTimeModel"
              },
              {
                  "begin": "2024-06-11T16:39:25.841035+09:00", // 出勤
                  "leaving": null, // 未退勤
                  "__typename": "AttendanceTimeModel"
              }
          ],
          "signTime": [
              {
                  "begin": "2024-06-11T13:05:20.632914+09:00",
                  "leaving": "2024-06-11T14:07:17.743891+09:00",
                  "signType": "rest",
                  "__typename": "SignTimeModel"
              }
          ],
          "retrospectiveComment": "",
          "__typename": "UserDailyAttendanceInformationModel"
      }
  ],
  "__typename": "UserWeeklyAttendanceInformationModel"
}
```

指定した日に出退勤情報がない場合。 `attendanceTime` が空配列になる。

```json
{
  "status": "success",
  "data": {
      "myAttendanceInformation": {
          "averageWorkTimeHours": 0,
          "userAttendanceInformation": [
              {
                  "date": "2024-06-20",
                  "attendanceTime": [],
                  "signTime": [],
                  "retrospectiveComment": "",
                  "__typename": "UserDailyAttendanceInformationModel"
              }
          ],
          "__typename": "UserWeeklyAttendanceInformationModel"
      }
  }
}
```
