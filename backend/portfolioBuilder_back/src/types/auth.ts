export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginUserInput = {
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
