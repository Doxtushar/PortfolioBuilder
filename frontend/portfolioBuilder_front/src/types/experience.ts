export type CreateExperienceInput = {
  companyName: string;
  jobTitle: string;
  employmentType?: string | null;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  description?: string | null;
};

export type UpdateExperienceInput = Partial<CreateExperienceInput>;

export type Experience = {
  id: string;
  portfolioId: string;
  companyName: string;
  jobTitle: string;
  employmentType: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};
