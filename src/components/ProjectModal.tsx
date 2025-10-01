// components/ProjectModal.tsx - Modal per creazione/modifica progetti con validazione

import React, { useState, FormEvent } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Project, ProjectFormData, FormErrors } from '../types';
import { OWNERS, STATUSES, PRIORITIES } from '../utils/constants';
import {
  validateProject,
  hasErrors,
  getErrorMessage,
} from '../utils/validation';
import { getStatusLabel } from '../utils/styleHelpers';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSave: (project: Project) => void;
  darkMode: boolean;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onSave,
  darkMode,
}) => {
  const [formData, setFormData] = useState<ProjectFormData>(
    project || {
      name: '',
      owner: OWNERS[0],
      description: '',
      startDate: '',
      endDate: '',
      status: 'da-fare',
      priority: 'medium',
      progress: 0,
      estimatedDays: 0,
      assignedDevs: [],
    }
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleChange = (field: keyof ProjectFormData, value: any) => {
    setFormData({ ...formData, [field]: value });

    // Pulisce l'errore del campo quando l'utente inizia a modificarlo
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Valida tutti i campi
    const validationErrors = validateProject(formData);

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      // Marca tutti i campi come touched per mostrare gli errori
      const allTouched = Object.keys(validationErrors).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);
      return;
    }

    // Crea o aggiorna il progetto
    const projectToSave: Project = {
      ...formData,
      id: project?.id || 'p' + Date.now(),
    };

    onSave(projectToSave);
    onClose();
  };

  const showError = (field: string): boolean => {
    return touched[field] && !!errors[field];
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div
        className={`${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold'>
              {project ? 'Modifica Progetto' : 'Nuovo Progetto'}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded hover:bg-gray-100 ${
                darkMode ? 'hover:bg-gray-700' : ''
              }`}
              type='button'
            >
              <X className='w-6 h-6' />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Nome Progetto */}
            <div className='md:col-span-2'>
              <label className='block text-sm font-semibold mb-2'>
                Nome Progetto *
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                className={`w-full px-4 py-2 rounded-lg border ${
                  showError('name')
                    ? 'border-red-500'
                    : darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
                placeholder='Inserisci il nome del progetto'
              />
              {showError('name') && (
                <div className='flex items-center gap-1 mt-1 text-red-500 text-sm'>
                  <AlertCircle className='w-4 h-4' />
                  <span>{getErrorMessage(errors, 'name')}</span>
                </div>
              )}
            </div>

            {/* Owner */}
            <div>
              <label className='block text-sm font-semibold mb-2'>
                Owner *
              </label>
              <select
                value={formData.owner}
                onChange={(e) => handleChange('owner', e.target.value)}
                onBlur={() => handleBlur('owner')}
                className={`w-full px-4 py-2 rounded-lg border ${
                  showError('owner')
                    ? 'border-red-500'
                    : darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              >
                {OWNERS.map((owner) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </select>
              {showError('owner') && (
                <div className='flex items-center gap-1 mt-1 text-red-500 text-sm'>
                  <AlertCircle className='w-4 h-4' />
                  <span>{getErrorMessage(errors, 'owner')}</span>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className='block text-sm font-semibold mb-2'>
                Stato *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>

            {/* Priorità */}
            <div>
              <label className='block text-sm font-semibold mb-2'>
                Priorità *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            {/* Progresso */}
            <div>
              <label className='block text-sm font-semibold mb-2'>
                Progresso (%) *
              </label>
              <input
                type='number'
                min='0'
                max='100'
                value={formData.progress}
                onChange={(e) =>
                  handleChange('progress', parseInt(e.target.value) || 0)
                }
                onBlur={() => handleBlur('progress')}
                className={`w-full px-4 py-2 rounded-lg border ${
                  showError('progress')
                    ? 'border-red-500'
                    : darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              />
              {showError('progress') && (
                <div className='flex items-center gap-1 mt-1 text-red-500 text-sm'>
                  <AlertCircle className='w-4 h-4' />
                  <span>{getErrorMessage(errors, 'progress')}</span>
                </div>
              )}
            </div>

            {/* CONTINUA NELLA PARTE 2 */}
            {/* CONTINUAZIONE DA PARTE 1 */}

            {/* Data Inizio */}
            <div>
              <label className='block text-sm font-semibold mb-2'>
                Data Inizio *
              </label>
              <input
                type='date'
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                onBlur={() => handleBlur('startDate')}
                className={`w-full px-4 py-2 rounded-lg border ${
                  showError('startDate')
                    ? 'border-red-500'
                    : darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              />
              {showError('startDate') && (
                <div className='flex items-center gap-1 mt-1 text-red-500 text-sm'>
                  <AlertCircle className='w-4 h-4' />
                  <span>{getErrorMessage(errors, 'startDate')}</span>
                </div>
              )}
            </div>

            {/* Data Fine */}
            <div>
              <label className='block text-sm font-semibold mb-2'>
                Data Fine *
              </label>
              <input
                type='date'
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                onBlur={() => handleBlur('endDate')}
                className={`w-full px-4 py-2 rounded-lg border ${
                  showError('endDate')
                    ? 'border-red-500'
                    : darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              />
              {showError('endDate') && (
                <div className='flex items-center gap-1 mt-1 text-red-500 text-sm'>
                  <AlertCircle className='w-4 h-4' />
                  <span>{getErrorMessage(errors, 'endDate')}</span>
                </div>
              )}
            </div>

            {/* Giorni Stimati */}
            <div>
              <label className='block text-sm font-semibold mb-2'>
                Giorni Stimati *
              </label>
              <input
                type='number'
                min='1'
                value={formData.estimatedDays}
                onChange={(e) =>
                  handleChange('estimatedDays', parseInt(e.target.value) || 0)
                }
                onBlur={() => handleBlur('estimatedDays')}
                className={`w-full px-4 py-2 rounded-lg border ${
                  showError('estimatedDays')
                    ? 'border-red-500'
                    : darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              />
              {showError('estimatedDays') && (
                <div className='flex items-center gap-1 mt-1 text-red-500 text-sm'>
                  <AlertCircle className='w-4 h-4' />
                  <span>{getErrorMessage(errors, 'estimatedDays')}</span>
                </div>
              )}
            </div>

            {/* Descrizione */}
            <div className='md:col-span-2'>
              <label className='block text-sm font-semibold mb-2'>
                Descrizione *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                rows={3}
                className={`w-full px-4 py-2 rounded-lg border ${
                  showError('description')
                    ? 'border-red-500'
                    : darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
                placeholder='Inserisci una descrizione dettagliata del progetto'
              />
              {showError('description') && (
                <div className='flex items-center gap-1 mt-1 text-red-500 text-sm'>
                  <AlertCircle className='w-4 h-4' />
                  <span>{getErrorMessage(errors, 'description')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'border-gray-600 hover:bg-gray-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              Annulla
            </button>
            <button
              type='submit'
              className='flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
            >
              {project ? 'Salva Modifiche' : 'Crea Progetto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;

/* NOTA: Questo file va unito con PARTE 1/2 in un unico file src/components/ProjectModal.tsx */
