// src/components/TimelineView.tsx

import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Project, Developer } from '../types';
import { getStatusColor, getStatusLabel, cn } from '../utils/styleHelpers';

interface TimelineViewProps {
  projects: Project[];
  developers: Developer[];
  darkMode: boolean;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  projects,
  developers,
  darkMode,
}) => {
  const [timelineView, setTimelineView] = useState<
    'gantt' | 'workload' | 'calendar'
  >('gantt');
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>(
    'quarter'
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Calcola il range di date per la timeline
  const getDateRange = () => {
    const today = new Date();
    const start = new Date(today);
    const end = new Date(today);

    if (timeRange === 'month') {
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    } else if (timeRange === 'quarter') {
      start.setMonth(start.getMonth() - 1);
      end.setMonth(end.getMonth() + 2);
    } else {
      start.setMonth(0);
      start.setDate(1);
      end.setMonth(11);
      end.setDate(31);
    }

    return { start, end };
  };

  const { start: rangeStart, end: rangeEnd } = getDateRange();

  // Filtra progetti per sviluppatore
  const filteredProjects =
    selectedDeveloper === 'all'
      ? projects
      : projects.filter((p) => p.assignedDevs.includes(selectedDeveloper));

  // Calcola il carico di lavoro per sviluppatore
  const calculateDeveloperWorkload = (devId: string) => {
    const devProjects = projects.filter(
      (p) => p.assignedDevs.includes(devId) && p.status !== 'completato'
    );

    const workloadByMonth: { [key: string]: number } = {};

    devProjects.forEach((project) => {
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);

      for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          '0'
        )}`;
        workloadByMonth[key] =
          (workloadByMonth[key] || 0) + 100 / project.assignedDevs.length;
      }
    });

    return workloadByMonth;
  };

  // Genera mesi per la vista
  const generateMonths = () => {
    const months = [];
    const current = new Date(rangeStart);

    while (current <= rangeEnd) {
      months.push({
        label: current.toLocaleDateString('it-IT', {
          month: 'short',
          year: 'numeric',
        }),
        date: new Date(current),
      });
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  };

  const months = generateMonths();

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Vista Gantt
  const renderGanttView = () => {
    // Genera i mesi per l'header della timeline
    const timelineMonths = generateMonths();

    return (
      <div className='overflow-x-auto'>
        {/* Header con i mesi */}
        <div className='flex mb-2 min-w-[800px]'>
          <div className='w-64 flex-shrink-0' />{' '}
          {/* Spazio per i nomi progetti */}
          <div className='flex-1 flex'>
            {timelineMonths.map((month, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex-1 text-center text-xs font-semibold py-2 border-l',
                  darkMode ? 'border-gray-600' : 'border-gray-300'
                )}
              >
                {month.label}
              </div>
            ))}
          </div>
        </div>

        {/* Righe dei progetti */}
        <div className='space-y-2'>
          {filteredProjects.map((project) => {
            const start = new Date(project.startDate);
            const end = new Date(project.endDate);
            const totalDays =
              (rangeEnd.getTime() - rangeStart.getTime()) /
              (1000 * 60 * 60 * 24);
            const projectStart = Math.max(
              0,
              (start.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)
            );
            const projectDuration =
              (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
            const leftPercent = (projectStart / totalDays) * 100;
            const widthPercent = (projectDuration / totalDays) * 100;

            return (
              <div
                key={project.id}
                className={cn(
                  'flex items-center min-w-[800px] cursor-pointer hover:shadow-md transition-all rounded-lg',
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                )}
                onClick={() => setSelectedProject(project)}
              >
                {/* Colonna sinistra: Info progetto */}
                <div className='w-64 flex-shrink-0 p-3 border-r border-gray-600'>
                  <h4
                    className='font-semibold text-sm mb-1 truncate'
                    title={project.name}
                  >
                    {project.name}
                  </h4>
                  <div className='flex items-center gap-2'>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded',
                        getStatusColor(project.status)
                      )}
                    >
                      {getStatusLabel(project.status)}
                    </span>
                    <span
                      className={cn(
                        'text-xs',
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      )}
                    >
                      {project.progress}%
                    </span>
                  </div>
                  <div className='flex items-center gap-1 mt-2'>
                    {project.assignedDevs.slice(0, 3).map((devId) => {
                      const dev = developers.find((d) => d.id === devId);
                      return dev ? (
                        <div
                          key={devId}
                          className='w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold'
                          title={dev.name}
                        >
                          {dev.name.substring(0, 2)}
                        </div>
                      ) : null;
                    })}
                    {project.assignedDevs.length > 3 && (
                      <span className='text-xs text-gray-500'>
                        +{project.assignedDevs.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Colonna destra: Barra temporale */}
                <div className='flex-1 p-3 relative'>
                  <div
                    className={cn(
                      'relative h-10 rounded-lg overflow-hidden',
                      darkMode ? 'bg-gray-800' : 'bg-gray-200'
                    )}
                  >
                    {/* Griglia verticale per i mesi */}
                    <div className='absolute inset-0 flex'>
                      {timelineMonths.map((_, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            'flex-1 border-l',
                            darkMode ? 'border-gray-600' : 'border-gray-300'
                          )}
                        />
                      ))}
                    </div>

                    {/* Barra del progetto */}
                    <div
                      className={cn(
                        'absolute h-full flex items-center justify-center text-xs font-semibold text-white shadow-lg',
                        getProgressColor(project.progress)
                      )}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    >
                      <span className='px-2 truncate'>
                        {new Date(project.startDate).toLocaleDateString(
                          'it-IT',
                          { day: '2-digit', month: 'short' }
                        )}{' '}
                        -{' '}
                        {new Date(project.endDate).toLocaleDateString('it-IT', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    </div>

                    {/* Linea oggi */}
                    {(() => {
                      const today = new Date();
                      const todayPosition =
                        ((today.getTime() - rangeStart.getTime()) /
                          (1000 * 60 * 60 * 24) /
                          totalDays) *
                        100;
                      if (todayPosition >= 0 && todayPosition <= 100) {
                        return (
                          <div
                            className='absolute top-0 bottom-0 w-0.5 bg-red-500 z-10'
                            style={{ left: `${todayPosition}%` }}
                            title='Oggi'
                          />
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legenda */}
        <div
          className={cn(
            'mt-4 p-3 rounded-lg flex items-center gap-4 text-xs',
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          )}
        >
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-red-500 rounded' />
            <span>Linea rossa = Oggi</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-red-500 rounded' />
            <span>&lt;30% completamento</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-yellow-500 rounded' />
            <span>30-70% completamento</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-green-500 rounded' />
            <span>&gt;70% completamento</span>
          </div>
        </div>
      </div>
    );
  };

  // Vista carico di lavoro
  const renderWorkloadView = () => {
    return (
      <div className='space-y-6'>
        {developers
          .filter(
            (dev) => selectedDeveloper === 'all' || dev.id === selectedDeveloper
          )
          .map((dev) => {
            const workload = calculateDeveloperWorkload(dev.id);
            const avgWorkload =
              Object.values(workload).reduce((a, b) => a + b, 0) /
                Object.keys(workload).length || 0;

            return (
              <div
                key={dev.id}
                className={cn(
                  'p-4 rounded-lg',
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                )}
              >
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold'>
                      {dev.name.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className='font-semibold'>{dev.name}</h4>
                      <p
                        className={cn(
                          'text-sm',
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        )}
                      >
                        {dev.role}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-2xl font-bold'>
                      {avgWorkload.toFixed(0)}%
                    </div>
                    <div
                      className={cn(
                        'text-xs',
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      )}
                    >
                      Carico medio
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-12 gap-1'>
                  {months.map((month, idx) => {
                    const key = `${month.date.getFullYear()}-${String(
                      month.date.getMonth() + 1
                    ).padStart(2, '0')}`;
                    const load = workload[key] || 0;
                    const height = Math.min(100, load);
                    const color =
                      load > 100
                        ? 'bg-red-500'
                        : load > 80
                        ? 'bg-orange-500'
                        : load > 50
                        ? 'bg-yellow-500'
                        : 'bg-green-500';

                    return (
                      <div key={idx} className='flex flex-col items-center'>
                        <div
                          className={cn(
                            'w-full h-24 rounded relative overflow-hidden',
                            darkMode ? 'bg-gray-600' : 'bg-gray-200'
                          )}
                        >
                          <div
                            className={cn('absolute bottom-0 w-full', color)}
                            style={{ height: `${height}%` }}
                            title={`${month.label}: ${load.toFixed(0)}%`}
                          />
                        </div>
                        <span
                          className={cn(
                            'text-xs mt-1 transform -rotate-45 origin-top-left',
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          )}
                        >
                          {month.label.substring(0, 3)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className='mt-4 flex items-center gap-4 text-xs'>
                  <div className='flex items-center gap-1'>
                    <div className='w-3 h-3 bg-green-500 rounded' />
                    <span>&lt;50%</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <div className='w-3 h-3 bg-yellow-500 rounded' />
                    <span>50-80%</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <div className='w-3 h-3 bg-orange-500 rounded' />
                    <span>80-100%</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <div className='w-3 h-3 bg-red-500 rounded' />
                    <span>&gt;100%</span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  // Vista calendario
  const renderCalendarView = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    const projectsByDay: { [key: number]: Project[] } = {};

    filteredProjects.forEach((project) => {
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        if (date >= start && date <= end) {
          if (!projectsByDay[day]) projectsByDay[day] = [];
          projectsByDay[day].push(project);
        }
      }
    });

    return (
      <div
        className={cn(
          'p-4 rounded-lg',
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        )}
      >
        <h3 className='text-lg font-semibold mb-4 text-center'>
          {new Date(currentYear, currentMonth).toLocaleDateString('it-IT', {
            month: 'long',
            year: 'numeric',
          })}
        </h3>

        <div className='grid grid-cols-7 gap-2'>
          {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day) => (
            <div key={day} className='text-center font-semibold text-sm p-2'>
              {day}
            </div>
          ))}

          {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map(
            (_, i) => (
              <div key={`empty-${i}`} className='p-2' />
            )
          )}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday =
              day === today.getDate() && currentMonth === today.getMonth();
            const dayProjects = projectsByDay[day] || [];

            return (
              <div
                key={day}
                className={cn(
                  'min-h-20 p-2 rounded border',
                  isToday
                    ? 'bg-blue-500 text-white border-blue-600'
                    : darkMode
                    ? 'bg-gray-600 border-gray-500'
                    : 'bg-white border-gray-200'
                )}
              >
                <div className='font-semibold text-sm mb-1'>{day}</div>
                <div className='space-y-1'>
                  {dayProjects.slice(0, 2).map((project) => (
                    <div
                      key={project.id}
                      className={cn(
                        'text-xs px-1 py-0.5 rounded truncate cursor-pointer',
                        getStatusColor(project.status)
                      )}
                      title={project.name}
                      onClick={() => setSelectedProject(project)}
                    >
                      {project.name.substring(0, 10)}...
                    </div>
                  ))}
                  {dayProjects.length > 2 && (
                    <div
                      className={cn(
                        'text-xs',
                        darkMode ? 'text-gray-300' : 'text-gray-500'
                      )}
                    >
                      +{dayProjects.length - 2}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300',
      medium:
        'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900 dark:text-orange-300',
      critical:
        'bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-300',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  return (
    <div className='space-y-4'>
      {/* Header con filtri */}
      <div
        className={cn(
          'p-4 rounded-lg shadow-md',
          darkMode ? 'bg-gray-800' : 'bg-white'
        )}
      >
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <Calendar className='w-5 h-5' />
            <h2 className='text-xl font-bold'>Timeline Progetti</h2>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            {/* Toggle vista */}
            <div
              className={cn(
                'flex rounded-lg overflow-hidden',
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              )}
            >
              <button
                onClick={() => setTimelineView('gantt')}
                className={cn(
                  'px-3 py-1 text-sm transition-colors',
                  timelineView === 'gantt' ? 'bg-blue-500 text-white' : ''
                )}
              >
                Gantt
              </button>
              <button
                onClick={() => setTimelineView('workload')}
                className={cn(
                  'px-3 py-1 text-sm transition-colors',
                  timelineView === 'workload' ? 'bg-blue-500 text-white' : ''
                )}
              >
                Carico
              </button>
              <button
                onClick={() => setTimelineView('calendar')}
                className={cn(
                  'px-3 py-1 text-sm transition-colors',
                  timelineView === 'calendar' ? 'bg-blue-500 text-white' : ''
                )}
              >
                Calendario
              </button>
            </div>

            {/* Filtro sviluppatore */}
            <select
              value={selectedDeveloper}
              onChange={(e) => setSelectedDeveloper(e.target.value)}
              className={cn(
                'px-3 py-1 rounded-lg text-sm border',
                darkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-100 border-gray-300'
              )}
            >
              <option value='all'>Tutti gli sviluppatori</option>
              {developers.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.name}
                </option>
              ))}
            </select>

            {/* Filtro periodo */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className={cn(
                'px-3 py-1 rounded-lg text-sm border',
                darkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-100 border-gray-300'
              )}
            >
              <option value='month'>Mese</option>
              <option value='quarter'>Trimestre</option>
              <option value='year'>Anno</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contenuto timeline */}
      <div
        className={cn(
          'p-4 rounded-lg shadow-md',
          darkMode ? 'bg-gray-800' : 'bg-white'
        )}
      >
        {timelineView === 'gantt' && renderGanttView()}
        {timelineView === 'workload' && renderWorkloadView()}
        {timelineView === 'calendar' && renderCalendarView()}
      </div>

      {/* Modal dettaglio progetto */}
      {selectedProject && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
          <div
            className={cn(
              'rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto',
              darkMode ? 'bg-gray-800' : 'bg-white'
            )}
          >
            <div className='p-6'>
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <h3 className='text-xl font-bold mb-2'>
                    {selectedProject.name}
                  </h3>
                  <p
                    className={cn(darkMode ? 'text-gray-400' : 'text-gray-500')}
                  >
                    {selectedProject.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className={cn(
                    'p-2 rounded-lg',
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  )}
                >
                  <X className='w-5 h-5' />
                </button>
              </div>

              <div className='grid grid-cols-2 gap-4 mb-4'>
                <div>
                  <label
                    className={cn(
                      'text-sm',
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    )}
                  >
                    Owner
                  </label>
                  <p className='font-semibold'>{selectedProject.owner}</p>
                </div>
                <div>
                  <label
                    className={cn(
                      'text-sm',
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    )}
                  >
                    Stato
                  </label>
                  <span
                    className={cn(
                      'inline-block px-2 py-1 rounded text-sm',
                      getStatusColor(selectedProject.status)
                    )}
                  >
                    {getStatusLabel(selectedProject.status)}
                  </span>
                </div>
                <div>
                  <label
                    className={cn(
                      'text-sm',
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    )}
                  >
                    Data Inizio
                  </label>
                  <p className='font-semibold'>
                    {new Date(selectedProject.startDate).toLocaleDateString(
                      'it-IT'
                    )}
                  </p>
                </div>
                <div>
                  <label
                    className={cn(
                      'text-sm',
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    )}
                  >
                    Data Fine
                  </label>
                  <p className='font-semibold'>
                    {new Date(selectedProject.endDate).toLocaleDateString(
                      'it-IT'
                    )}
                  </p>
                </div>
                <div>
                  <label
                    className={cn(
                      'text-sm',
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    )}
                  >
                    Priorità
                  </label>
                  <span
                    className={cn(
                      'inline-block px-2 py-1 rounded text-sm',
                      getPriorityColor(selectedProject.priority)
                    )}
                  >
                    {selectedProject.priority.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label
                    className={cn(
                      'text-sm',
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    )}
                  >
                    Giorni Stimati
                  </label>
                  <p className='font-semibold'>
                    {selectedProject.estimatedDays}
                  </p>
                </div>
              </div>

              <div className='mb-4'>
                <label
                  className={cn(
                    'text-sm mb-2 block',
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  )}
                >
                  Progresso
                </label>
                <div
                  className={cn(
                    'w-full rounded-full h-4',
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  )}
                >
                  <div
                    className={cn(
                      'h-4 rounded-full flex items-center justify-center text-xs text-white font-semibold',
                      getProgressColor(selectedProject.progress)
                    )}
                    style={{ width: `${selectedProject.progress}%` }}
                  >
                    {selectedProject.progress}%
                  </div>
                </div>
              </div>

              <div>
                <label
                  className={cn(
                    'text-sm mb-2 block',
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  )}
                >
                  Team Assegnato
                </label>
                <div className='flex flex-wrap gap-2'>
                  {selectedProject.assignedDevs.map((devId) => {
                    const dev = developers.find((d) => d.id === devId);
                    return dev ? (
                      <div
                        key={devId}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg',
                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        )}
                      >
                        <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold'>
                          {dev.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className='font-semibold text-sm'>
                            {dev.name}
                          </div>
                          <div
                            className={cn(
                              'text-xs',
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            )}
                          >
                            {dev.role}
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineView;
