// utils/validation.ts - Sistema di validazione form

import { ProjectFormData, FormErrors } from '../types';
import { ERROR_MESSAGES } from './constants';

export const validateProject = (data: ProjectFormData): FormErrors => {
  const errors: FormErrors = {};

  // Validazione nome
  if (!data.name || data.name.trim().length === 0) {
    errors.name = ERROR_MESSAGES.REQUIRED_FIELD;
  } else if (data.name.trim().length < 3) {
    errors.name = ERROR_MESSAGES.NAME_TOO_SHORT;
  }

  // Validazione owner
  if (!data.owner || data.owner.trim().length === 0) {
    errors.owner = ERROR_MESSAGES.REQUIRED_FIELD;
  }

  // Validazione descrizione
  if (!data.description || data.description.trim().length === 0) {
    errors.description = ERROR_MESSAGES.REQUIRED_FIELD;
  } else if (data.description.trim().length < 10) {
    errors.description = ERROR_MESSAGES.DESCRIPTION_TOO_SHORT;
  }

  // Validazione date
  if (!data.startDate) {
    errors.startDate = ERROR_MESSAGES.REQUIRED_FIELD;
  }

  if (!data.endDate) {
    errors.endDate = ERROR_MESSAGES.REQUIRED_FIELD;
  }

  // Validazione ordine date
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (isNaN(start.getTime())) {
      errors.startDate = ERROR_MESSAGES.INVALID_DATE;
    }

    if (isNaN(end.getTime())) {
      errors.endDate = ERROR_MESSAGES.INVALID_DATE;
    }

    if (!errors.startDate && !errors.endDate && end < start) {
      errors.endDate = ERROR_MESSAGES.END_BEFORE_START;
    }
  }

  // Validazione progress
  if (data.progress < 0 || data.progress > 100) {
    errors.progress = ERROR_MESSAGES.INVALID_PROGRESS;
  }

  // Validazione giorni stimati
  if (!data.estimatedDays || data.estimatedDays <= 0) {
    errors.estimatedDays = ERROR_MESSAGES.INVALID_DAYS;
  }

  return errors;
};

export const hasErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export const getErrorMessage = (
  errors: FormErrors,
  field: string
): string | undefined => {
  return errors[field];
};
