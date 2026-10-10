export type CreateCertificationInput = {
  name: string;
  issuingOrganization: string;
  issueDate?: string | null;
  expirationDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  description?: string | null;
  displayOrder?: number;
};

export type UpdateCertificationInput = Partial<CreateCertificationInput>;

export type Certification = {
  id: string;
  portfolioId: string;
  name: string;
  issuingOrganization: string;
  issueDate: string | null;
  expirationDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  description: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};
