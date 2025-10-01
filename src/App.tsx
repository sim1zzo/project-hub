// src/App.tsx - Versione refactorizzata

import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Calendar,
  BarChart3,
  Moon,
  Sun,
  Menu,
  X,
  Plus,
  Search,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Import componenti
import ProjectModal from './components/ProjectModal';
import ProjectCard from './components/ProjectCard';

// Import types
import { Project, Developer, PageType } from './types';

// Import constants
import { STORAGE_KEYS, OWNERS, STATUSES } from './utils/constants';

// Import style helpers
import { getStatusColor, getStatusLabel, cn } from './utils/styleHelpers';

// Import hooks
import { useLocalStorage } from './hooks/useLocalStorage';

// Import services
import { generateMockData } from './services/dataService';

const App: React.FC = () => {
  // ============= STATE MANAGEMENT =============
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Dark mode con localStorage
  const [darkMode, setDarkMode] = useLocalStorage(STORAGE_KEYS.DARK_MODE, false);

  // Dati con localStorage e dati mock come fallback
  const { projects: defaultProjects, developers: defaultDevelopers } = generateMockData();
  
  const [projects, setProjects] = useLocalStorage<Project[]>(
    STORAGE_KEYS.PROJECTS,
    defaultProjects
  );

  const [developers, setDevelopers] = useLocalStorage<Developer[]>(
    STORAGE_KEYS.DEVELOPERS,
    defaultDevelopers
  );

  // ============= HANDLERS =============
  
  const handleSaveProject = (project: Project) => {
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      // Update existing
      const updatedProjects = [...projects];
      updatedProjects[existingIndex] = project;
      setProjects(updatedProjects);
    } else {
      // Add new
      setProjects([...projects, project]);
    }
    
    setEditingProject(null);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowAddModal(true);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingProject(null);
  };

  // ============= COMPUTED VALUES =============
  
  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completato').length,
    inProgress: projects.filter(p => p.status === 'in-corso').length,
    blocked: projects.filter(p => p.status === 'bloccato').length,
  };

  // ============= RENDER =============
  
  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* HEADER */}
      <header
        className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-b sticky top-0 z-40`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold">Project Hub</h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                )}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={cn(
            "w-64 min-h-screen border-r",
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
            sidebarOpen ? "block" : "hidden lg:block"
          )}
        >
          <nav className="p-4 space-y-2">
            <NavButton
              icon={<LayoutDashboard className="w-5 h-5" />}
              label="Dashboard"
              active={currentPage === 'dashboard'}
              onClick={() => setCurrentPage('dashboard')}
              darkMode={darkMode}
            />
            <NavButton
              icon={<FolderKanban className="w-5 h-5" />}
              label="Progetti"
              active={currentPage === 'projects'}
              onClick={() => setCurrentPage('projects')}
              darkMode={darkMode}
            />
            <NavButton
              icon={<Users className="w-5 h-5" />}
              label="Team"
              active={currentPage === 'team'}
              onClick={() => setCurrentPage('team')}
              darkMode={darkMode}
            />
            <NavButton
              icon={<Calendar className="w-5 h-5" />}
              label="Timeline"
              active={currentPage === 'timeline'}
              onClick={() => setCurrentPage('timeline')}
              darkMode={darkMode}
            />
            <NavButton
              icon={<BarChart3 className="w-5 h-5" />}
              label="Metriche"
              active={currentPage === 'metrics'}
              onClick={() => setCurrentPage('metrics')}
              darkMode={darkMode}
            />
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {currentPage === 'dashboard' && (
              <DashboardView
                projects={projects}
                stats={stats}
                darkMode={darkMode}
                onEditProject={handleEditProject}
                onDeleteProject={handleDeleteProject}
              />
            )}
            
            {currentPage === 'projects' && (
              <ProjectsView
                projects={projects}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onEditProject={handleEditProject}
                onDeleteProject={handleDeleteProject}
                onAddNew={() => {
                  setEditingProject(null);
                  setShowAddModal(true);
                }}
                darkMode={darkMode}
              />
            )}

            {currentPage === 'team' && (
              <TeamView developers={developers} projects={projects} darkMode={darkMode} />
            )}

            {currentPage === 'timeline' && <TimelineView darkMode={darkMode} />}

            {currentPage === 'metrics' && (
              <MetricsView projects={projects} darkMode={darkMode} />
            )}
          </div>
        </main>
      </div>

      {/* MODAL */}
      {showAddModal && (
        <ProjectModal
          project={editingProject}
          onClose={handleCloseModal}
          onSave={handleSaveProject}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

// ============= SUB-COMPONENTS =============

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  darkMode: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({
  icon,
  label,
  active,
  onClick,
  darkMode,
}) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
      active
        ? darkMode
          ? 'bg-blue-600 text-white'
          : 'bg-blue-500 text-white'
        : darkMode
        ? 'hover:bg-gray-700'
        : 'hover:bg-gray-100'
    )}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// ============= VIEW COMPONENTS =============

interface DashboardViewProps {
  projects: Project[];
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    blocked: number;
  };
  darkMode: boolean;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  stats,
  darkMode,
  onEditProject,
  onDeleteProject,
}) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Dashboard</h2>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        label="Totale Progetti"
        value={stats.total}
        color="blue"
        darkMode={darkMode}
      />
      <StatCard
        label="Completati"
        value={stats.completed}
        color="green"
        darkMode={darkMode}
      />
      <StatCard
        label="In Corso"
        value={stats.inProgress}
        color="yellow"
        darkMode={darkMode}
      />
      <StatCard
        label="Bloccati"
        value={stats.blocked}
        color="red"
        darkMode={darkMode}
      />
    </div>

    {/* Recent Projects */}
    <div>
      <h3 className="text-xl font-semibold mb-4">Progetti Recenti</h3>
      <div className="space-y-4">
        {projects.slice(0, 5).map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={onEditProject}
            onDelete={onDeleteProject}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  </div>
);

interface StatCardProps {
  label: string;
  value: number;
  color: 'blue' | 'green' | 'yellow' | 'red';
  darkMode: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color, darkMode }) => {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    red: 'text-red-600 dark:text-red-400',
  };

  return (
    <div
      className={cn(
        'p-6 rounded-lg shadow-md',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}
    >
      <p className={cn('text-sm mb-2', darkMode ? 'text-gray-400' : 'text-gray-500')}>
        {label}
      </p>
      <p className={cn('text-3xl font-bold', colorClasses[color])}>{value}</p>
    </div>
  );
};

interface ProjectsViewProps {
  projects: Project[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onAddNew: () => void;
  darkMode: boolean;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  searchQuery,
  onSearchChange,
  onEditProject,
  onDeleteProject,
  onAddNew,
  darkMode,
}) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOwner, setFilterOwner] = useState('all');

  const filteredProjects = projects.filter(p => {
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesOwner = filterOwner === 'all' || p.owner === filterOwner;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesOwner && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Progetti</h2>
        <button
          onClick={onAddNew}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuovo Progetto
        </button>
      </div>

      {/* Filters */}
      <div
        className={cn(
          'p-4 rounded-lg shadow-md',
          darkMode ? 'bg-gray-800' : 'bg-white'
        )}
      >
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca progetto..."
              className={cn(
                'w-full pl-10 pr-4 py-2 rounded-lg border',
                darkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              )}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <select
            className={cn(
              'px-4 py-2 rounded-lg border',
              darkMode
                ? 'bg-gray-700 border-gray-600'
                : 'bg-white border-gray-300'
            )}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tutti gli stati</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {getStatusLabel(status)}
              </option>
            ))}
          </select>

          <select
            className={cn(
              'px-4 py-2 rounded-lg border',
              darkMode
                ? 'bg-gray-700 border-gray-600'
                : 'bg-white border-gray-300'
            )}
            value={filterOwner}
            onChange={(e) => setFilterOwner(e.target.value)}
          >
            <option value="all">Tutti gli owner</option>
            {OWNERS.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div
            className={cn(
              'p-12 rounded-lg shadow-md text-center',
              darkMode ? 'bg-gray-800' : 'bg-white'
            )}
          >
            <p className="text-gray-500">Nessun progetto trovato</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={onEditProject}
              onDelete={onDeleteProject}
              darkMode={darkMode}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface TeamViewProps {
  developers: Developer[];
  projects: Project[];
  darkMode: boolean;
}

const TeamView: React.FC<TeamViewProps> = ({ developers, projects, darkMode }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Team</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {developers.map((dev) => {
        const utilization = (dev.allocatedHours / dev.weeklyHours) * 100;
        return (
          <div
            key={dev.id}
            className={cn(
              'rounded-lg shadow-md p-6',
              darkMode ? 'bg-gray-800' : 'bg-white'
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                {dev.name.substring(0, 2)}
              </div>
              <div>
                <h3 className="font-bold">{dev.name}</h3>
                <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>
                  {dev.role}
                </p>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Utilizzo</span>
                <span className="font-bold">{utilization.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={cn(
                    'h-3 rounded-full',
                    utilization >= 90 ? 'bg-red-500' :
                    utilization >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                  )}
                  style={{ width: `${utilization}%` }}
                />
              </div>
            </div>

            <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>
              Progetti: {dev.projects.length}
            </p>
          </div>
        );
      })}
    </div>
  </div>
);

interface TimelineViewProps {
  darkMode: boolean;
}

const TimelineView: React.FC<TimelineViewProps> = ({ darkMode }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Timeline</h2>
    <div
      className={cn(
        'p-12 rounded-lg shadow-md text-center',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}
    >
      <p className={cn(darkMode ? 'text-gray-400' : 'text-gray-500')}>
        Vista timeline in sviluppo...
      </p>
    </div>
  </div>
);

interface MetricsViewProps {
  projects: Project[];
  darkMode: boolean;
}

const MetricsView: React.FC<MetricsViewProps> = ({ projects, darkMode }) => {
  const statusData = [
    {
      name: 'In corso',
      value: projects.filter((p) => p.status === 'in-corso').length,
    },
    {
      name: 'Completato',
      value: projects.filter((p) => p.status === 'completato').length,
    },
    {
      name: 'Da fare',
      value: projects.filter((p) => p.status === 'da-fare').length,
    },
    {
      name: 'Bloccato',
      value: projects.filter((p) => p.status === 'bloccato').length,
    },
    {
      name: 'Posticipato',
      value: projects.filter((p) => p.status === 'posticipato').length,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Metriche</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={cn(
            'p-6 rounded-lg shadow-md',
            darkMode ? 'bg-gray-800' : 'bg-white'
          )}
        >
          <h3 className="text-lg font-semibold mb-4">Distribuzione per Stato</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                dataKey="value"
              >
                <Cell fill="#3B82F6" />
                <Cell fill="#10B981" />
                <Cell fill="#6B7280" />
                <Cell fill="#EF4444" />
                <Cell fill="#8B5CF6" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div
          className={cn(
            'p-6 rounded-lg shadow-md',
            darkMode ? 'bg-gray-800' : 'bg-white'
          )}
        >
          <h3 className="text-lg font-semibold mb-4">Statistiche</h3>
          <div className="space-y-4">
            <div className="flex justify-between p-3 rounded bg-gray-50 dark:bg-gray-700">
              <span>Totale Progetti</span>
              <span className="font-bold text-2xl">{projects.length}</span>
            </div>
            <div className="flex justify-between p-3 rounded bg-green-50 dark:bg-green-900">
              <span>Completati</span>
              <span className="font-bold text-2xl text-green-600 dark:text-green-400">
                {projects.filter((p) => p.status === 'completato').length}
              </span>
            </div>
            <div className="flex justify-between p-3 rounded bg-blue-50 dark:bg-blue-900">
              <span>In Corso</span>
              <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                {projects.filter((p) => p.status === 'in-corso').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;