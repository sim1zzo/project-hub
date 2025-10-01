// types/index.ts - Tutti i tipi TypeScript centralizzati

export type ProjectStatus =
  | 'da-fare'
  | 'in-corso'
  | 'completato'
  | 'in-attesa'
  | 'bloccato'
  | 'posticipato'
  | 'deroga'
  | 'ritardo';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type DeveloperRole = 'backend' | 'frontend' | 'fullstack';

export type Seniority = 'junior' | 'mid' | 'senior' | 'lead';

export interface Project {
  id: string;
  name: string;
  owner: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  priority: Priority;
  progress: number;
  estimatedDays: number;
  assignedDevs: string[];
}

export interface Developer {
  id: string;
  name: string;
  role: DeveloperRole;
  seniority: Seniority;
  weeklyHours: number;
  allocatedHours: number;
  projects: string[];
}

export interface ProjectFormData extends Omit<Project, 'id'> {
  id?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}

export type PageType =
  | 'dashboard'
  | 'projects'
  | 'team'
  | 'timeline'
  | 'metrics';
