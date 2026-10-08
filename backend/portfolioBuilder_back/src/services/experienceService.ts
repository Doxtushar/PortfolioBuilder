import { AppError } from '../utils/AppError.js';
import type { CreateExperienceInput, Experience, UpdateExperienceInput } from '../types/experience.js';
import type { experienceRepository } from '../repositories/experienceRepository.js';

type ExperienceServiceDeps = {
  repository: typeof experienceRepository;
};

const toExperience = (experience: Experience): Experience => ({
  id: experience.id,
  portfolioId: experience.portfolioId,
  companyName: experience.companyName,
  jobTitle: experience.jobTitle,
  employmentType: experience.employmentType,
  location: experience.location,
  startDate: experience.startDate,
  endDate: experience.endDate,
  isCurrent: experience.isCurrent,
  description: experience.description,
  createdAt: experience.createdAt,
  updatedAt: experience.updatedAt,
});

export const createExperienceService = ({ repository }: ExperienceServiceDeps) => {
  return {
    async createExperience(portfolioId: string, input: CreateExperienceInput): Promise<Experience> {
      const experience = await repository.create(portfolioId, input);
      return toExperience(experience);
    },

    async getExperiences(portfolioId: string): Promise<Experience[]> {
      const experiences = await repository.findByPortfolioId(portfolioId);
      return experiences.map(toExperience);
    },

    async getExperience(id: string, portfolioId: string): Promise<Experience> {
      const experience = await repository.findByIdAndPortfolioId(id, portfolioId);

      if (!experience) {
        throw new AppError('Experience not found', 404, 'EXPERIENCE_NOT_FOUND');
      }

      return toExperience(experience);
    },

    async updateExperience(
      id: string,
      portfolioId: string,
      input: UpdateExperienceInput,
    ): Promise<Experience> {
      const experience = await repository.update(id, portfolioId, input);

      if (!experience) {
        throw new AppError('Experience not found', 404, 'EXPERIENCE_NOT_FOUND');
      }

      return toExperience(experience);
    },

    async deleteExperience(id: string, portfolioId: string): Promise<void> {
      const deleted = await repository.delete(id, portfolioId);

      if (!deleted) {
        throw new AppError('Experience not found', 404, 'EXPERIENCE_NOT_FOUND');
      }
    },
  };
};

export const experienceService = createExperienceService({
  repository: await import('../repositories/experienceRepository.js').then((m) => m.experienceRepository),
});
