import { AppError } from '../utils/AppError.js';
import type { CreateCertificationInput, UpdateCertificationInput } from '../types/certification.js';

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateCreateCertificationInput = (input: unknown): CreateCertificationInput => {
  if (typeof input !== 'object' || input === null) {
    throw new AppError('Invalid certification input', 422, 'VALIDATION_ERROR');
  }

  const data = input as Record<string, unknown>;

  if (typeof data.name !== 'string' || data.name.trim() === '') {
    throw new AppError('Certification name is required and cannot be empty', 422, 'VALIDATION_ERROR');
  }

  if (typeof data.issuingOrganization !== 'string' || data.issuingOrganization.trim() === '') {
    throw new AppError('Issuing organization is required and cannot be empty', 422, 'VALIDATION_ERROR');
  }

  if (data.issueDate !== undefined && data.issueDate !== null && data.issueDate !== '') {
    if (typeof data.issueDate !== 'string' || data.issueDate.trim() === '') {
      throw new AppError('Invalid issue date', 422, 'VALIDATION_ERROR');
    }

    const issueDate = new Date(data.issueDate);
    if (isNaN(issueDate.getTime())) {
      throw new AppError('Invalid issue date', 422, 'VALIDATION_ERROR');
    }
  }

  if (data.expirationDate !== undefined && data.expirationDate !== null && data.expirationDate !== '') {
    if (typeof data.expirationDate !== 'string' || data.expirationDate.trim() === '') {
      throw new AppError('Invalid expiration date', 422, 'VALIDATION_ERROR');
    }

    const expirationDate = new Date(data.expirationDate);
    if (isNaN(expirationDate.getTime())) {
      throw new AppError('Invalid expiration date', 422, 'VALIDATION_ERROR');
    }

    if (data.issueDate && typeof data.issueDate === 'string') {
      const issueDate = new Date(data.issueDate);
      if (expirationDate < issueDate) {
        throw new AppError('Expiration date must be after or equal to issue date', 422, 'VALIDATION_ERROR');
      }
    }
  }

  if (data.credentialUrl !== undefined && data.credentialUrl !== null && data.credentialUrl !== '') {
    if (typeof data.credentialUrl !== 'string') {
      throw new AppError('Invalid credential URL', 422, 'VALIDATION_ERROR');
    }

    if (!isValidUrl(data.credentialUrl.trim())) {
      throw new AppError('Credential URL must be a valid URL', 422, 'VALIDATION_ERROR');
    }
  }

  const result: CreateCertificationInput = {
    name: data.name.trim(),
    issuingOrganization: data.issuingOrganization.trim(),
  };

  if (data.issueDate !== undefined && data.issueDate !== null && data.issueDate !== '') {
    result.issueDate = data.issueDate.trim();
  }

  if (data.expirationDate !== undefined && data.expirationDate !== null && data.expirationDate !== '') {
    result.expirationDate = data.expirationDate.trim();
  }

  if (data.credentialId !== undefined && data.credentialId !== null && data.credentialId !== '') {
    if (typeof data.credentialId !== 'string') {
      throw new AppError('Invalid credential ID', 422, 'VALIDATION_ERROR');
    }
    result.credentialId = data.credentialId.trim();
  }

  if (data.credentialUrl !== undefined && data.credentialUrl !== null && data.credentialUrl !== '') {
    result.credentialUrl = data.credentialUrl.trim();
  }

  if (data.description !== undefined && data.description !== null && data.description !== '') {
    if (typeof data.description !== 'string') {
      throw new AppError('Invalid description', 422, 'VALIDATION_ERROR');
    }
    result.description = data.description.trim();
  }

  if (typeof data.displayOrder === 'number') {
    result.displayOrder = data.displayOrder;
  }

  return result;
};

export const validateUpdateCertificationInput = (input: unknown): UpdateCertificationInput => {
  if (typeof input !== 'object' || input === null) {
    throw new AppError('Invalid certification input', 422, 'VALIDATION_ERROR');
  }

  const data = input as Record<string, unknown>;
  const result: UpdateCertificationInput = {};

  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim() === '') {
      throw new AppError('Certification name cannot be empty', 422, 'VALIDATION_ERROR');
    }
    result.name = data.name.trim();
  }

  if (data.issuingOrganization !== undefined) {
    if (typeof data.issuingOrganization !== 'string' || data.issuingOrganization.trim() === '') {
      throw new AppError('Issuing organization cannot be empty', 422, 'VALIDATION_ERROR');
    }
    result.issuingOrganization = data.issuingOrganization.trim();
  }

  if (data.issueDate !== undefined) {
    if (data.issueDate !== null && data.issueDate !== '') {
      if (typeof data.issueDate !== 'string' || data.issueDate.trim() === '') {
        throw new AppError('Invalid issue date', 422, 'VALIDATION_ERROR');
      }
      const issueDate = new Date(data.issueDate);
      if (isNaN(issueDate.getTime())) {
        throw new AppError('Invalid issue date', 422, 'VALIDATION_ERROR');
      }
      result.issueDate = data.issueDate.trim();
    } else {
      result.issueDate = null;
    }
  }

  if (data.expirationDate !== undefined) {
    if (data.expirationDate !== null && data.expirationDate !== '') {
      if (typeof data.expirationDate !== 'string' || data.expirationDate.trim() === '') {
        throw new AppError('Invalid expiration date', 422, 'VALIDATION_ERROR');
      }
      const expirationDate = new Date(data.expirationDate);
      if (isNaN(expirationDate.getTime())) {
        throw new AppError('Invalid expiration date', 422, 'VALIDATION_ERROR');
      }
      result.expirationDate = data.expirationDate.trim();
    } else {
      result.expirationDate = null;
    }
  }

  if (data.credentialId !== undefined) {
    if (data.credentialId !== null && data.credentialId !== '') {
      if (typeof data.credentialId !== 'string') {
        throw new AppError('Invalid credential ID', 422, 'VALIDATION_ERROR');
      }
      result.credentialId = data.credentialId.trim();
    } else {
      result.credentialId = null;
    }
  }

  if (data.credentialUrl !== undefined) {
    if (data.credentialUrl !== null && data.credentialUrl !== '') {
      if (typeof data.credentialUrl !== 'string') {
        throw new AppError('Invalid credential URL', 422, 'VALIDATION_ERROR');
      }
      if (!isValidUrl(data.credentialUrl.trim())) {
        throw new AppError('Credential URL must be a valid URL', 422, 'VALIDATION_ERROR');
      }
      result.credentialUrl = data.credentialUrl.trim();
    } else {
      result.credentialUrl = null;
    }
  }

  if (data.description !== undefined) {
    if (data.description !== null && data.description !== '') {
      if (typeof data.description !== 'string') {
        throw new AppError('Invalid description', 422, 'VALIDATION_ERROR');
      }
      result.description = data.description.trim();
    } else {
      result.description = null;
    }
  }

  if (data.displayOrder !== undefined) {
    if (typeof data.displayOrder !== 'number') {
      throw new AppError('Invalid display order', 422, 'VALIDATION_ERROR');
    }
    result.displayOrder = data.displayOrder;
  }

  if (Object.keys(result).length === 0) {
    throw new AppError('At least one field must be provided for update', 422, 'VALIDATION_ERROR');
  }

  return result;
};
