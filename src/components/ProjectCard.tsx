// components/ProjectCard.tsx - Card riutilizzabile per visualizzare un progetto

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Project } from '../types';
import {
  getStatusColor,
  getStatusLabel,
  getPriorityColor,
  getProgressColor,
  getRemainingDaysColor,
} from '../utils/styleHelpers';
import { getTotalDays, getRemainingWorkingDays } from '../utils/dateHelpers';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  darkMode: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  darkMode,
}) => {
  const totalDays = getTotalDays(project.startDate, project.endDate);
  const remainingDays = getRemainingWorkingDays(project.endDate);

  const handleDelete = () => {
    if (
      window.confirm(
        `Sei sicuro di voler eliminare il progetto "${project.name}"?`
      )
    ) {
      onDelete(project.id);
    }
  };

  return (
    <div
      className={`${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow`}
    >
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Informazioni principali */}
        <div className='flex-1'>
          <div className='flex items-start justify-between mb-3'>
            <div>
              <h3 className='font-bold text-xl mb-2'>{project.name}</h3>
              <div className='flex gap-2 flex-wrap'>
                <span
                  className={`text-xs px-2 py-1 rounded ${getStatusColor(
                    project.status
                  )}`}
                >
                  {getStatusLabel(project.status)}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded border ${getPriorityColor(
                    project.priority
                  )}`}
                >
                  {project.priority}
                </span>
              </div>
            </div>

            {/* Azioni */}
            <div className='flex gap-2'>
              <button
                onClick={() => onEdit(project)}
                className={`p-2 rounded transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                title='Modifica progetto'
              >
                <Edit2 className='w-4 h-4' />
              </button>
              <button
                onClick={handleDelete}
                className={`p-2 rounded transition-colors ${
                  darkMode ? 'hover:bg-red-900' : 'hover:bg-red-100'
                }`}
                title='Elimina progetto'
              >
                <Trash2 className='w-4 h-4 text-red-500' />
              </button>
            </div>
          </div>

          {/* Descrizione */}
          <p
            className={`text-sm mb-3 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {project.description}
          </p>

          {/* Dettagli */}
          <div className='space-y-2'>
            <p
              className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Owner: <span className='font-semibold'>{project.owner}</span>
            </p>
            <div className='flex items-center gap-4 text-sm flex-wrap'>
              <span>Totale: {totalDays} gg</span>
              <span>Stimati: {project.estimatedDays} gg</span>
              <span className={getRemainingDaysColor(remainingDays)}>
                Gg lav. rim.: {remainingDays}
              </span>
            </div>
            {project.assignedDevs.length > 0 && (
              <p className='text-sm'>
                Sviluppatori assegnati: {project.assignedDevs.length}
              </p>
            )}
          </div>
        </div>

        {/* Progresso */}
        <div className='lg:w-32 flex lg:flex-col items-center lg:items-end justify-between lg:justify-start'>
          <div className='text-right'>
            <div className='text-3xl font-bold mb-2'>{project.progress}%</div>
            <div className='w-24 bg-gray-200 rounded-full h-3'>
              <div
                className={`h-3 rounded-full transition-all ${getProgressColor(
                  project.progress
                )}`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
