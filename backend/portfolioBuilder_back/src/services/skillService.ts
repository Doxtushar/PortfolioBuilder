import { AppError } from '../utils/AppError.js';
import type { CreateSkillInput, Skill, UpdateSkillInput } from '../types/skill.js';
import type { skillRepository } from '../repositories/skillRepository.js';

type SkillServiceDeps = {
  repository: typeof skillRepository;
};

const toSkill = (skill: Skill): Skill => ({
  id: skill.id,
  portfolioId: skill.portfolioId,
  name: skill.name,
  category: skill.category,
  proficiency: skill.proficiency,
  displayOrder: skill.displayOrder,
  createdAt: skill.createdAt,
  updatedAt: skill.updatedAt,
});

export const createSkillService = ({ repository }: SkillServiceDeps) => {
  return {
    async createSkill(portfolioId: string, input: CreateSkillInput): Promise<Skill> {
      const skill = await repository.create(portfolioId, input);
      return toSkill(skill);
    },

    async getSkills(portfolioId: string): Promise<Skill[]> {
      const skills = await repository.findByPortfolioId(portfolioId);
      return skills.map(toSkill);
    },

    async getSkill(id: string, portfolioId: string): Promise<Skill> {
      const skill = await repository.findByIdAndPortfolioId(id, portfolioId);

      if (!skill) {
        throw new AppError('Skill not found', 404, 'SKILL_NOT_FOUND');
      }

      return toSkill(skill);
    },

    async updateSkill(
      id: string,
      portfolioId: string,
      input: UpdateSkillInput,
    ): Promise<Skill> {
      const skill = await repository.update(id, portfolioId, input);

      if (!skill) {
        throw new AppError('Skill not found', 404, 'SKILL_NOT_FOUND');
      }

      return toSkill(skill);
    },

    async deleteSkill(id: string, portfolioId: string): Promise<void> {
      const deleted = await repository.delete(id, portfolioId);

      if (!deleted) {
        throw new AppError('Skill not found', 404, 'SKILL_NOT_FOUND');
      }
    },
  };
};

export const skillService = createSkillService({
  repository: await import('../repositories/skillRepository.js').then((m) => m.skillRepository),
});
