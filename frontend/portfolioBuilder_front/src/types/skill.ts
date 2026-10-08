export type CreateSkillInput = {
  name: string;
  category: string;
  proficiency?: number;
  displayOrder?: number;
};

export type UpdateSkillInput = CreateSkillInput;

export type Skill = {
  id: string;
  portfolioId: string;
  name: string;
  category: string;
  proficiency: number | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};
