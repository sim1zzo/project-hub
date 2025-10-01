// utils/styleHelpers.ts - Helper per classi CSS e colori

import { ProjectStatus, Priority } from '../types';
import { STATUS_COLORS, PRIORITY_COLORS, STATUS_LABELS } from './constants';

/**
 * Restituisce le classi CSS per lo status di un progetto
 */
export const getStatusColor = (status: ProjectStatus): string => {
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-700';
};

/**
 * Restituisce la label leggibile per uno status
 */
export const getStatusLabel = (status: ProjectStatus): string => {
  return STATUS_LABELS[status] || status;
};

/**
 * Restituisce le classi CSS per la priorità di un progetto
 */
export const getPriorityColor = (priority: Priority): string => {
  return (
    PRIORITY_COLORS[priority] || 'bg-gray-100 text-gray-700 border-gray-300'
  );
};

/**
 * Restituisce il colore della barra di progresso basato sulla percentuale
 */
export const getProgressColor = (progress: number): string => {
  if (progress < 30) return 'bg-red-500';
  if (progress < 70) return 'bg-yellow-500';
  return 'bg-green-500';
};

/**
 * Restituisce il colore per i giorni rimanenti
 */
export const getRemainingDaysColor = (remainingDays: number): string => {
  if (remainingDays > 10) return 'text-green-500';
  if (remainingDays > 0) return 'text-yellow-500';
  return 'text-red-500';
};

/**
 * Combina classi CSS condizionalmente
 */
export const cn = (
  ...classes: (string | boolean | undefined | null)[]
): string => {
  return classes.filter(Boolean).join(' ');
};
