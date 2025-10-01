// utils/constants.ts - Tutte le costanti dell'applicazione

import { ProjectStatus, Priority } from '../types';

export const OWNERS = [
  'L.Rossetti',
  'L.Frangella',
  'C.Tedesco',
  'F.Patacconi',
  'P.Epifania',
  'M.Massarotto',
  'C&L',
  'A.Rago',
  'Tutti',
] as const;

export const STATUSES: ProjectStatus[] = [
  'da-fare',
  'in-corso',
  'completato',
  'in-attesa',
  'bloccato',
  'posticipato',
  'deroga',
  'ritardo',
];

export const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'critical'];

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  'da-fare': 'Da fare',
  'in-corso': 'In corso',
  completato: 'Completato',
  'in-attesa': 'In attesa',
  bloccato: 'Bloccato',
  posticipato: 'Posticipato',
  deroga: 'Deroga',
  ritardo: 'Ritardo',
};

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  'da-fare': 'bg-gray-100 text-gray-700',
  'in-corso': 'bg-blue-100 text-blue-700',
  completato: 'bg-green-100 text-green-700',
  'in-attesa': 'bg-yellow-100 text-yellow-700',
  bloccato: 'bg-red-100 text-red-700',
  posticipato: 'bg-purple-100 text-purple-700',
  deroga: 'bg-orange-100 text-orange-700',
  ritardo: 'bg-pink-100 text-pink-700',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-green-100 text-green-700 border-green-300',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  high: 'bg-orange-100 text-orange-700 border-orange-300',
  critical: 'bg-red-100 text-red-700 border-red-300',
};

export const STORAGE_KEYS = {
  PROJECTS: 'projects',
  DEVELOPERS: 'developers',
  DARK_MODE: 'darkMode',
} as const;

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Questo campo è obbligatorio',
  INVALID_DATE: 'Data non valida',
  END_BEFORE_START:
    'La data di fine deve essere successiva alla data di inizio',
  INVALID_PROGRESS: 'Il progresso deve essere tra 0 e 100',
  INVALID_DAYS: 'I giorni stimati devono essere maggiori di 0',
  NAME_TOO_SHORT: 'Il nome deve contenere almeno 3 caratteri',
  DESCRIPTION_TOO_SHORT: 'La descrizione deve contenere almeno 10 caratteri',
} as const;
