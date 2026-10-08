export type CreateEducationInput = {
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  description?: string | null;
  displayOrder?: number;
};

export type UpdateEducationInput = Partial<CreateEducationInput>;

export type Education = {
  id: string;
  portfolioId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};
