import { AppError } from '../utils/AppError.js';
import type { CreateEducationInput, Education, UpdateEducationInput } from '../types/education.js';
import type { educationRepository } from '../repositories/educationRepository.js';

type EducationServiceDeps = {
  repository: typeof educationRepository;
};

const toEducation = (education: Education): Education => ({
  id: education.id,
  portfolioId: education.portfolioId,
  institution: education.institution,
  degree: education.degree,
  fieldOfStudy: education.fieldOfStudy,
  location: education.location,
  startDate: education.startDate,
  endDate: education.endDate,
  isCurrent: education.isCurrent,
  description: education.description,
  displayOrder: education.displayOrder,
  createdAt: education.createdAt,
  updatedAt: education.updatedAt,
});

export const createEducationService = ({ repository }: EducationServiceDeps) => {
  return {
    async createEducation(portfolioId: string, input: CreateEducationInput): Promise<Education> {
      const education = await repository.create(portfolioId, input);
      return toEducation(education);
    },

    async getEducation(portfolioId: string): Promise<Education[]> {
      const education = await repository.findByPortfolioId(portfolioId);
      return education.map(toEducation);
    },

    async getEducationById(id: string, portfolioId: string): Promise<Education> {
      const education = await repository.findByIdAndPortfolioId(id, portfolioId);

      if (!education) {
        throw new AppError('Education not found', 404, 'EDUCATION_NOT_FOUND');
      }

      return toEducation(education);
    },

    async updateEducation(
      id: string,
      portfolioId: string,
      input: UpdateEducationInput,
    ): Promise<Education> {
      const education = await repository.update(id, portfolioId, input);

      if (!education) {
        throw new AppError('Education not found', 404, 'EDUCATION_NOT_FOUND');
      }

      return toEducation(education);
    },

    async deleteEducation(id: string, portfolioId: string): Promise<void> {
      const deleted = await repository.delete(id, portfolioId);

      if (!deleted) {
        throw new AppError('Education not found', 404, 'EDUCATION_NOT_FOUND');
      }
    },
  };
};

export const educationService = createEducationService({
  repository: await import('../repositories/educationRepository.js').then((m) => m.educationRepository),
});
