import { AppError } from '../utils/AppError.js';
import type { CreateSkillInput, UpdateSkillInput } from '../types/skill.js';

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const validateSkillInput = (input: unknown): CreateSkillInput => {
  if (!isRecord(input)) {
    throw new AppError('Invalid skill input', 422, 'VALIDATION_ERROR');
  }

  const name = input.name;
  const category = input.category;
  const proficiency = input.proficiency;
  const displayOrder = input.displayOrder;

  if (typeof name !== 'string') {
    throw new AppError('Skill name is required', 422, 'VALIDATION_ERROR');
  }

  const trimmedName = name.trim();
  if (trimmedName === '') {
    throw new AppError('Skill name cannot be empty', 422, 'VALIDATION_ERROR');
  }

  if (typeof category !== 'string') {
    throw new AppError('Skill category is required', 422, 'VALIDATION_ERROR');
  }

  const trimmedCategory = category.trim();
  if (trimmedCategory === '') {
    throw new AppError('Skill category cannot be empty', 422, 'VALIDATION_ERROR');
  }

  const result: CreateSkillInput = {
    name: trimmedName,
    category: trimmedCategory,
  };

  if (proficiency !== undefined && proficiency !== null) {
    if (typeof proficiency !== 'number') {
      throw new AppError('Proficiency must be a number', 422, 'VALIDATION_ERROR');
    }

    if (proficiency < 0 || proficiency > 100) {
      throw new AppError('Proficiency must be between 0 and 100', 422, 'VALIDATION_ERROR');
    }

    result.proficiency = proficiency;
  }

  if (displayOrder !== undefined && displayOrder !== null) {
    if (typeof displayOrder !== 'number') {
      throw new AppError('Display order must be a number', 422, 'VALIDATION_ERROR');
    }

    result.displayOrder = displayOrder;
  }

  return result;
};

export const validateCreateSkillInput = (input: unknown): CreateSkillInput => {
  return validateSkillInput(input);
};

export const validateUpdateSkillInput = (input: unknown): UpdateSkillInput => {
  if (!isRecord(input)) {
    throw new AppError('Invalid skill input', 422, 'VALIDATION_ERROR');
  }

  if (Object.keys(input).length === 0) {
    throw new AppError('At least one field must be provided for update', 422, 'VALIDATION_ERROR');
  }

  return validateSkillInput(input);
};
