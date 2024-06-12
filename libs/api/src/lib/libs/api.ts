/**
 * タブ間通信のレスポンスのベース
 */
type InterTabCommunicationResponse<TResponse> = {
  status: 'success',
  data: TResponse,
} | {
  status: 'error',
  cause: any,
};

/**
 * GraphQLのレスポンスのベース
 */
type GraphQLResponse<TResponse> = (
  {
    data: null,
    errors: Array<any>,
  } | {
    data: TResponse,
    errors?: undefined,
  }
);

/**
 * WagoraのGraphQL APIのレスポンス.data部
 */
export type GetMyAttendanceInformationResponse = {
  myAttendanceInformation: {
    averageWorkTimeHours: number,
    userAttendanceInformation: Array<{
      date: string,
      attendanceTime: Array<{
        begin: string,
        leaving: string | null,
      }>,
      signTime: Array<{
        begin: string,
        leaving: string,
        signType: string,
      }>,
      retrospectiveComment: string,
    }>,
  },
};

export type WagoraGetMyAttendanceInformationResponse = GraphQLResponse<GetMyAttendanceInformationResponse>;
export type ChromeGetMyAttendanceInformationResponse = InterTabCommunicationResponse<GetMyAttendanceInformationResponse>;

// {
//     "data": {
//         "myAttendanceInformation": {
//             "averageWorkTimeHours": 0,
//             "userAttendanceInformation": [
//                 {
//                     "date": "2024-06-04",
//                     "attendanceTime": [
//                         {
//                             "begin": "2024-06-04T10:04:08.106381+09:00",
//                             "leaving": null,
//                             "__typename": "AttendanceTimeModel"
//                         }
//                     ],
//                     "signTime": [
//                         {
//                             "begin": "2024-06-04T12:44:24.517602+09:00",
//                             "leaving": "2024-06-04T13:46:19.679714+09:00",
//                             "signType": "rest",
//                             "__typename": "SignTimeModel"
//                         }
//                     ],
//                     "retrospectiveComment": "",
//                     "__typename": "UserDailyAttendanceInformationModel"
//                 }
//             ],
//             "__typename": "UserWeeklyAttendanceInformationModel"
//         }
//     }
// }

// {
//   "averageWorkTimeHours": 5.7,
//   "userAttendanceInformation": [
//       {
//           "date": "2024-06-11",
//           "attendanceTime": [
//               {
//                   "begin": "2024-06-11T09:59:14.69908+09:00", // 出勤
//                   "leaving": "2024-06-11T16:39:06.132624+09:00", // 退勤
//                   "__typename": "AttendanceTimeModel"
//               },
//               {
//                   "begin": "2024-06-11T16:39:11.039632+09:00", // 出勤
//                   "leaving": "2024-06-11T16:39:19.088145+09:00", // 退勤
//                   "__typename": "AttendanceTimeModel"
//               },
//               {
//                   "begin": "2024-06-11T16:39:25.841035+09:00", // 出勤
//                   "leaving": null, // 未退勤
//                   "__typename": "AttendanceTimeModel"
//               }
//           ],
//           "signTime": [
//               {
//                   "begin": "2024-06-11T13:05:20.632914+09:00",
//                   "leaving": "2024-06-11T14:07:17.743891+09:00",
//                   "signType": "rest",
//                   "__typename": "SignTimeModel"
//               }
//           ],
//           "retrospectiveComment": "",
//           "__typename": "UserDailyAttendanceInformationModel"
//       }
//   ],
//   "__typename": "UserWeeklyAttendanceInformationModel"
// }

// {
//   "status": "success",
//   "data": {
//       "myAttendanceInformation": {
//           "averageWorkTimeHours": 0,
//           "userAttendanceInformation": [
//               {
//                   "date": "2024-06-20",
//                   "attendanceTime": [],
//                   "signTime": [],
//                   "retrospectiveComment": "",
//                   "__typename": "UserDailyAttendanceInformationModel"
//               }
//           ],
//           "__typename": "UserWeeklyAttendanceInformationModel"
//       }
//   }
// }