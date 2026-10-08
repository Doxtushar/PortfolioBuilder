import { AppError } from '../utils/AppError.js';
import type { CreateExperienceInput, UpdateExperienceInput } from '../types/experience.js';

export const validateCreateExperienceInput = (input: unknown): CreateExperienceInput => {
  if (typeof input !== 'object' || input === null) {
    throw new AppError('Invalid experience input', 422, 'VALIDATION_ERROR');
  }

  const data = input as Record<string, unknown>;

  if (typeof data.companyName !== 'string' || data.companyName.trim() === '') {
    throw new AppError('Company name is required and cannot be empty', 422, 'VALIDATION_ERROR');
  }

  if (typeof data.jobTitle !== 'string' || data.jobTitle.trim() === '') {
    throw new AppError('Job title is required and cannot be empty', 422, 'VALIDATION_ERROR');
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
    throw new AppError('End date must be null when job is current', 422, 'VALIDATION_ERROR');
  }

  const result: CreateExperienceInput = {
    companyName: data.companyName.trim(),
    jobTitle: data.jobTitle.trim(),
    startDate: data.startDate.trim(),
  };

  if (data.employmentType !== undefined && data.employmentType !== null && data.employmentType !== '') {
    if (typeof data.employmentType !== 'string') {
      throw new AppError('Invalid employment type', 422, 'VALIDATION_ERROR');
    }
    result.employmentType = data.employmentType.trim();
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

  return result;
};

export const validateUpdateExperienceInput = (input: unknown): UpdateExperienceInput => {
  if (typeof input !== 'object' || input === null) {
    throw new AppError('Invalid experience input', 422, 'VALIDATION_ERROR');
  }

  const data = input as Record<string, unknown>;
  const result: UpdateExperienceInput = {};

  if (data.companyName !== undefined) {
    if (typeof data.companyName !== 'string' || data.companyName.trim() === '') {
      throw new AppError('Company name cannot be empty', 422, 'VALIDATION_ERROR');
    }
    result.companyName = data.companyName.trim();
  }

  if (data.jobTitle !== undefined) {
    if (typeof data.jobTitle !== 'string' || data.jobTitle.trim() === '') {
      throw new AppError('Job title cannot be empty', 422, 'VALIDATION_ERROR');
    }
    result.jobTitle = data.jobTitle.trim();
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

  if (data.employmentType !== undefined) {
    if (data.employmentType !== null && data.employmentType !== '') {
      if (typeof data.employmentType !== 'string') {
        throw new AppError('Invalid employment type', 422, 'VALIDATION_ERROR');
      }
      result.employmentType = data.employmentType.trim();
    } else {
      result.employmentType = null;
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

  if (Object.keys(result).length === 0) {
    throw new AppError('At least one field must be provided for update', 422, 'VALIDATION_ERROR');
  }

  return result;
};
