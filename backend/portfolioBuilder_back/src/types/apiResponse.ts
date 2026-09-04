export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message: string;
};

export type ApiErrorResponse = {
  success: false;
  data: null;
  message: string;
  code: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
