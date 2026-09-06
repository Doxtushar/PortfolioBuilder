export type CreatePortfolioInput = {
  username: string;
  title: string;
  bio: string | null;
};

export type UpdatePortfolioInput = CreatePortfolioInput;

export type Portfolio = {
  id: string;
  username: string;
  title: string;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
};
