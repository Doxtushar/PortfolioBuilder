export type CreatePortfolioInput = {
  username: string;
  title: string;
  bio: string | null;
  fullName?: string;
  headline?: string;
  location?: string;
  introduction?: string;
  profileImageUrl?: string;
};

export type UpdatePortfolioInput = CreatePortfolioInput;

export type Portfolio = {
  id: string;
  username: string;
  title: string;
  bio: string | null;
  fullName: string | null;
  headline: string | null;
  location: string | null;
  introduction: string | null;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};
