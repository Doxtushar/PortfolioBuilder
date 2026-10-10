import { AppError } from '../utils/AppError.js';
import type { CreateCertificationInput, Certification, UpdateCertificationInput } from '../types/certification.js';
import type { certificationRepository } from '../repositories/certificationRepository.js';

type CertificationServiceDeps = {
  repository: typeof certificationRepository;
};

const toCertification = (certification: Certification): Certification => ({
  id: certification.id,
  portfolioId: certification.portfolioId,
  name: certification.name,
  issuingOrganization: certification.issuingOrganization,
  issueDate: certification.issueDate,
  expirationDate: certification.expirationDate,
  credentialId: certification.credentialId,
  credentialUrl: certification.credentialUrl,
  description: certification.description,
  displayOrder: certification.displayOrder,
  createdAt: certification.createdAt,
  updatedAt: certification.updatedAt,
});

export const createCertificationService = ({ repository }: CertificationServiceDeps) => {
  return {
    async createCertification(portfolioId: string, input: CreateCertificationInput): Promise<Certification> {
      const certification = await repository.create(portfolioId, input);
      return toCertification(certification);
    },

    async getCertifications(portfolioId: string): Promise<Certification[]> {
      const certifications = await repository.findByPortfolioId(portfolioId);
      return certifications.map(toCertification);
    },

    async getCertificationById(id: string, portfolioId: string): Promise<Certification> {
      const certification = await repository.findByIdAndPortfolioId(id, portfolioId);

      if (!certification) {
        throw new AppError('Certification not found', 404, 'CERTIFICATION_NOT_FOUND');
      }

      return toCertification(certification);
    },

    async updateCertification(
      id: string,
      portfolioId: string,
      input: UpdateCertificationInput,
    ): Promise<Certification> {
      const certification = await repository.update(id, portfolioId, input);

      if (!certification) {
        throw new AppError('Certification not found', 404, 'CERTIFICATION_NOT_FOUND');
      }

      return toCertification(certification);
    },

    async deleteCertification(id: string, portfolioId: string): Promise<void> {
      const deleted = await repository.delete(id, portfolioId);

      if (!deleted) {
        throw new AppError('Certification not found', 404, 'CERTIFICATION_NOT_FOUND');
      }
    },
  };
};

export const certificationService = createCertificationService({
  repository: await import('../repositories/certificationRepository.js').then((m) => m.certificationRepository),
});
