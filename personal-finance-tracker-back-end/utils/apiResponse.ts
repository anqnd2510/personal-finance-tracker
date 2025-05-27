export class ApiResponse<T> {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: T,
    public isSuccess: boolean = true
  ) {}

  static success<T>(
    data: T,
    message = "Success",
    statusCode = 200
  ): ApiResponse<T> {
    return new ApiResponse(statusCode, message, data, true);
  }

  static error(message = "Error", statusCode = 500): ApiResponse<null> {
    return new ApiResponse(statusCode, message, null, false);
  }
}
