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

