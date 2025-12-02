export class ApiResponseDto<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };

  constructor(data?: T, message?: string) {
    this.success = true;
    this.data = data;
    this.message = message;
  }

  static success<T>(data?: T, message?: string): ApiResponseDto<T> {
    return new ApiResponseDto(data, message);
  }

  static error(
    code: string,
    message: string,
    details?: any,
  ): ApiResponseDto<null> {
    const response = new ApiResponseDto<null>();
    response.success = false;
    response.error = { code, message, details };
    return response;
  }
}
