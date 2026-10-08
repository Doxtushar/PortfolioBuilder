import { AppError } from '../utils/AppError.js';
import type { CreateEducationInput, UpdateEducationInput } from '../types/education.js';

export const validateCreateEducationInput = (input: unknown): CreateEducationInput => {
  if (typeof input !== 'object' || input === null) {
    throw new AppError('Invalid education input', 422, 'VALIDATION_ERROR');
  }

  const data = input as Record<string, unknown>;

  if (typeof data.institution !== 'string' || data.institution.trim() === '') {
    throw new AppError('Institution is required and cannot be empty', 422, 'VALIDATION_ERROR');
  }

  if (typeof data.degree !== 'string' || data.degree.trim() === '') {
    throw new AppError('Degree is required and cannot be empty', 422, 'VALIDATION_ERROR');
  }

  if (typeof data.startDate !== 'string' || data.startDate.trim() === '') {
    throw new AppError('Start date is required', 422, 'VALIDATION_ERROR');
  }

  const startDate = new Date(data.startDate);
  if (isNaN(startDate.getTime())) {
    throw new AppError('Invalid start date', 422, 'VALIDATION_ERROR');
  }

  if (data.endDate !== undefined && data.endDate !== null && data.endDate !== '') {
    if (typeof data.endDate !== 'string' || data.endDate.trim() === '') {
      throw new AppError('Invalid end date', 422, 'VALIDATION_ERROR');
    }

    const endDate = new Date(data.endDate);
    if (isNaN(endDate.getTime())) {
      throw new AppError('Invalid end date', 422, 'VALIDATION_ERROR');
    }

    if (endDate < startDate) {
      throw new AppError('End date must be after or equal to start date', 422, 'VALIDATION_ERROR');
    }
  }

  if (data.isCurrent === true && data.endDate !== undefined && data.endDate !== null && data.endDate !== '') {
    throw new AppError('End date must be null when currently studying', 422, 'VALIDATION_ERROR');
  }

  const result: CreateEducationInput = {
    institution: data.institution.trim(),
    degree: data.degree.trim(),
    startDate: data.startDate.trim(),
  };

  if (data.fieldOfStudy !== undefined && data.fieldOfStudy !== null && data.fieldOfStudy !== '') {
    if (typeof data.fieldOfStudy !== 'string') {
      throw new AppError('Invalid field of study', 422, 'VALIDATION_ERROR');
    }
    result.fieldOfStudy = data.fieldOfStudy.trim();
  }

  if (data.location !== undefined && data.location !== null && data.location !== '') {
    if (typeof data.location !== 'string') {
      throw new AppError('Invalid location', 422, 'VALIDATION_ERROR');
    }
    result.location = data.location.trim();
  }

  if (data.endDate !== undefined && data.endDate !== null && data.endDate !== '') {
    result.endDate = data.endDate.trim();
  }

  if (typeof data.isCurrent === 'boolean') {
    result.isCurrent = data.isCurrent;
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

export const validateUpdateEducationInput = (input: unknown): UpdateEducationInput => {
  if (typeof input !== 'object' || input === null) {
    throw new AppError('Invalid education input', 422, 'VALIDATION_ERROR');
  }

  const data = input as Record<string, unknown>;
  const result: UpdateEducationInput = {};

  if (data.institution !== undefined) {
    if (typeof data.institution !== 'string' || data.institution.trim() === '') {
      throw new AppError('Institution cannot be empty', 422, 'VALIDATION_ERROR');
    }
    result.institution = data.institution.trim();
  }

  if (data.degree !== undefined) {
    if (typeof data.degree !== 'string' || data.degree.trim() === '') {
      throw new AppError('Degree cannot be empty', 422, 'VALIDATION_ERROR');
    }
    result.degree = data.degree.trim();
  }

  if (data.startDate !== undefined) {
    if (typeof data.startDate !== 'string' || data.startDate.trim() === '') {
      throw new AppError('Start date cannot be empty', 422, 'VALIDATION_ERROR');
    }
    const startDate = new Date(data.startDate);
    if (isNaN(startDate.getTime())) {
      throw new AppError('Invalid start date', 422, 'VALIDATION_ERROR');
    }
    result.startDate = data.startDate.trim();
  }

  if (data.endDate !== undefined) {
    if (data.endDate !== null && data.endDate !== '') {
      if (typeof data.endDate !== 'string' || data.endDate.trim() === '') {
        throw new AppError('Invalid end date', 422, 'VALIDATION_ERROR');
      }
      const endDate = new Date(data.endDate);
      if (isNaN(endDate.getTime())) {
        throw new AppError('Invalid end date', 422, 'VALIDATION_ERROR');
      }
      result.endDate = data.endDate.trim();
    } else {
      result.endDate = null;
    }
  }

  if (data.isCurrent !== undefined) {
    if (typeof data.isCurrent !== 'boolean') {
      throw new AppError('Invalid is_current value', 422, 'VALIDATION_ERROR');
    }
    result.isCurrent = data.isCurrent;
  }

  if (data.fieldOfStudy !== undefined) {
    if (data.fieldOfStudy !== null && data.fieldOfStudy !== '') {
      if (typeof data.fieldOfStudy !== 'string') {
        throw new AppError('Invalid field of study', 422, 'VALIDATION_ERROR');
      }
      result.fieldOfStudy = data.fieldOfStudy.trim();
    } else {
      result.fieldOfStudy = null;
    }
  }

  if (data.location !== undefined) {
    if (data.location !== null && data.location !== '') {
      if (typeof data.location !== 'string') {
        throw new AppError('Invalid location', 422, 'VALIDATION_ERROR');
      }
      result.location = data.location.trim();
    } else {
      result.location = null;
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
