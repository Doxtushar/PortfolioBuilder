export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type InitialPortfolio = {
  id: string;
  username: string;
  title: string;
  createdAt: string;
};

export type RegistrationResult = {
  user: SafeUser;
  portfolio: InitialPortfolio;
};

export type LoginResult = {
  user: SafeUser;
  token: string;
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

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
