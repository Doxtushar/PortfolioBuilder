export type CreateProjectInput = {
  title: string;
  description?: string;
  technologies?: string;
  projectUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
};

export type UpdateProjectInput = CreateProjectInput;

export type Project = {
  id: string;
  portfolioId: string;
  title: string;
  description: string | null;
  technologies: string | null;
  projectUrl: string | null;
  githubUrl: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};
