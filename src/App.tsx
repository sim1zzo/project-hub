import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Calendar,
  BarChart3,
  Bell,
  Plus,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Edit2,
  Trash2,
  Eye,
  Clock,
  Target,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Download,
  ChevronDown,
  Save,
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

// Types
interface Project {
  id: string;
  name: string;
  owner: string;
  description: string;
  startDate: string;
  endDate: string;
  status:
    | 'da-fare'
    | 'in-corso'
    | 'completato'
    | 'in-attesa'
    | 'bloccato'
    | 'posticipato'
    | 'deroga'
    | 'ritardo';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  estimatedDays: number;
  assignedDevs: string[];
}

interface Developer {
  id: string;
  name: string;
  role: 'backend' | 'frontend' | 'fullstack';
  seniority: 'junior' | 'mid' | 'senior' | 'lead';
  weeklyHours: number;
  allocatedHours: number;
  projects: string[];
}

const generateRealData = () => {
  const developers: Developer[] = [
    {
      id: 'd1',
      name: 'A.Pesce',
      role: 'backend',
      seniority: 'senior',
      weeklyHours: 40,
      allocatedHours: 32,
      projects: ['p1', 'p8'],
    },
    {
      id: 'd2',
      name: 'A.Rago',
      role: 'frontend',
      seniority: 'lead',
      weeklyHours: 40,
      allocatedHours: 35,
      projects: ['p2', 'p9'],
    },
    {
      id: 'd3',
      name: 'M.Zanoni',
      role: 'fullstack',
      seniority: 'senior',
      weeklyHours: 40,
      allocatedHours: 30,
      projects: ['p3', 'p10'],
    },
    {
      id: 'd4',
      name: 'Caesar',
      role: 'backend',
      seniority: 'mid',
      weeklyHours: 40,
      allocatedHours: 28,
      projects: ['p4', 'p11'],
    },
    {
      id: 'd5',
      name: 'M.Massarotto',
      role: 'fullstack',
      seniority: 'senior',
      weeklyHours: 40,
      allocatedHours: 36,
      projects: ['p5', 'p12'],
    },
    {
      id: 'd6',
      name: 'Pio/Amedeo',
      role: 'frontend',
      seniority: 'mid',
      weeklyHours: 40,
      allocatedHours: 25,
      projects: ['p6', 'p13'],
    },
    {
      id: 'd7',
      name: 'TBA',
      role: 'backend',
      seniority: 'junior',
      weeklyHours: 40,
      allocatedHours: 15,
      projects: ['p7'],
    },
    {
      id: 'd8',
      name: 'Tutti',
      role: 'fullstack',
      seniority: 'lead',
      weeklyHours: 40,
      allocatedHours: 38,
      projects: ['p14', 'p15', 'p16'],
    },
  ];

  const projects: Project[] = [
    {
      id: 'p1',
      name: 'Simulatore 2.0 pt1.1',
      owner: 'L.Rossetti',
      description: 'Prima parte del simulatore versione 2.0',
      startDate: '2025-06-01',
      endDate: '2025-12-31',
      status: 'posticipato',
      priority: 'high',
      progress: 15,
      estimatedDays: 120,
      assignedDevs: ['d1', 'd2'],
    },
    {
      id: 'p2',
      name: 'Simulatore 2.0 pt 1.2',
      owner: 'L.Frangella',
      description: 'Seconda parte del simulatore versione 2.0',
      startDate: '2025-07-01',
      endDate: '2026-01-31',
      status: 'posticipato',
      priority: 'high',
      progress: 10,
      estimatedDays: 130,
      assignedDevs: ['d2', 'd3'],
    },
    {
      id: 'p3',
      name: 'Simulatore 2.0 pt2',
      owner: 'C.Tedesco',
      description: 'Parte 2 completa del simulatore',
      startDate: '2025-08-01',
      endDate: '2026-03-31',
      status: 'posticipato',
      priority: 'medium',
      progress: 5,
      estimatedDays: 150,
      assignedDevs: ['d3'],
    },
    {
      id: 'p4',
      name: 'Evolutive Tool Metriche e Modelli',
      owner: 'F.Patacconi',
      description: 'Evoluzione tool per metriche e modelli',
      startDate: '2025-05-15',
      endDate: '2025-11-30',
      status: 'posticipato',
      priority: 'medium',
      progress: 20,
      estimatedDays: 100,
      assignedDevs: ['d4'],
    },
    {
      id: 'p5',
      name: 'Tool Analisi Dati Piattaforma IoT',
      owner: 'P.Epifania',
      description: 'Tool per analisi dati IoT',
      startDate: '2025-03-01',
      endDate: '2025-09-30',
      status: 'completato',
      priority: 'high',
      progress: 100,
      estimatedDays: 140,
      assignedDevs: ['d5'],
    },
    {
      id: 'p6',
      name: 'Standardizzazione del Frontend per i Tool IoT',
      owner: 'M.Massarotto',
      description: 'Standardizzazione frontend IoT',
      startDate: '2025-07-01',
      endDate: '2025-12-15',
      status: 'bloccato',
      priority: 'critical',
      progress: 35,
      estimatedDays: 110,
      assignedDevs: ['d6', 'd2'],
    },
    {
      id: 'p7',
      name: 'Tool Anagrafica Metriche',
      owner: 'C&L',
      description: 'Tool per anagrafica delle metriche',
      startDate: '2025-09-01',
      endDate: '2026-02-28',
      status: 'da-fare',
      priority: 'medium',
      progress: 0,
      estimatedDays: 100,
      assignedDevs: ['d7'],
    },
    {
      id: 'p8',
      name: 'Evolutive Tool Availability',
      owner: 'A.Rago',
      description: 'Evolutive per tool availability',
      startDate: '2025-08-01',
      endDate: '2025-12-31',
      status: 'in-corso',
      priority: 'high',
      progress: 55,
      estimatedDays: 90,
      assignedDevs: ['d1', 'd8'],
    },
    {
      id: 'p9',
      name: 'Evolutive Tool Testing Automation Wave 1',
      owner: 'Tutti',
      description: 'Prima wave automazione testing',
      startDate: '2025-07-15',
      endDate: '2025-11-30',
      status: 'in-corso',
      priority: 'high',
      progress: 60,
      estimatedDays: 85,
      assignedDevs: ['d2', 'd8'],
    },
    {
      id: 'p10',
      name: 'Plugin DIGIC',
      owner: 'L.Rossetti',
      description: 'Sviluppo plugin DIGIC',
      startDate: '2025-08-01',
      endDate: '2025-12-15',
      status: 'in-corso',
      priority: 'critical',
      progress: 70,
      estimatedDays: 95,
      assignedDevs: ['d3', 'd4'],
    },
    {
      id: 'p11',
      name: 'Evolutive Dashboard DIGIC',
      owner: 'L.Frangella',
      description: 'Evolutive dashboard DIGIC',
      startDate: '2025-07-01',
      endDate: '2025-11-30',
      status: 'in-corso',
      priority: 'high',
      progress: 50,
      estimatedDays: 90,
      assignedDevs: ['d4', 'd5'],
    },
    {
      id: 'p12',
      name: 'Dashboard DIGIL + demo',
      owner: 'C.Tedesco',
      description: 'Dashboard DIGIL con demo',
      startDate: '2025-06-01',
      endDate: '2025-10-31',
      status: 'deroga',
      priority: 'critical',
      progress: 80,
      estimatedDays: 100,
      assignedDevs: ['d5', 'd6'],
    },
    {
      id: 'p13',
      name: 'Algoritmo Manicotto di Ghiaccio',
      owner: 'F.Patacconi',
      description: 'Algoritmo per manicotto di ghiaccio',
      startDate: '2025-05-01',
      endDate: '2025-10-15',
      status: 'deroga',
      priority: 'medium',
      progress: 85,
      estimatedDays: 110,
      assignedDevs: ['d6'],
    },
    {
      id: 'p14',
      name: 'Evolutive Dashboard DIGIL',
      owner: 'P.Epifania',
      description: 'Evolutive per dashboard DIGIL',
      startDate: '2025-09-15',
      endDate: '2026-03-31',
      status: 'da-fare',
      priority: 'medium',
      progress: 0,
      estimatedDays: 120,
      assignedDevs: ['d8'],
    },
    {
      id: 'p15',
      name: 'Mobile APP',
      owner: 'M.Massarotto',
      description: 'Applicazione mobile',
      startDate: '2025-08-01',
      endDate: '2026-04-30',
      status: 'bloccato',
      priority: 'high',
      progress: 25,
      estimatedDays: 180,
      assignedDevs: ['d8', 'd2'],
    },
    {
      id: 'p16',
      name: 'Plugin DIGIL',
      owner: 'C&L',
      description: 'Plugin per DIGIL',
      startDate: '2025-09-01',
      endDate: '2026-01-31',
      status: 'in-corso',
      priority: 'high',
      progress: 45,
      estimatedDays: 100,
      assignedDevs: ['d8', 'd3'],
    },
    {
      id: 'p17',
      name: 'Analisi Servizio di Centralino',
      owner: 'A.Rago',
      description: 'Analisi servizio centralino',
      startDate: '2025-09-15',
      endDate: '2025-12-31',
      status: 'in-corso',
      priority: 'medium',
      progress: 40,
      estimatedDays: 70,
      assignedDevs: ['d2', 'd4'],
    },
    {
      id: 'p18',
      name: 'Adeguamento MongoDB',
      owner: 'Tutti',
      description: 'Adeguamento database MongoDB',
      startDate: '2025-10-01',
      endDate: '2026-02-28',
      status: 'da-fare',
      priority: 'high',
      progress: 0,
      estimatedDays: 90,
      assignedDevs: ['d1', 'd8'],
    },
  ];

  return { developers, projects };
};

const getStatusColor = (status: string) => {
  const colors = {
    'da-fare': 'bg-gray-100 text-gray-700',
    'in-corso': 'bg-blue-100 text-blue-700',
    completato: 'bg-green-100 text-green-700',
    'in-attesa': 'bg-yellow-100 text-yellow-700',
    bloccato: 'bg-red-100 text-red-700',
    posticipato: 'bg-purple-100 text-purple-700',
    deroga: 'bg-orange-100 text-orange-700',
    ritardo: 'bg-pink-100 text-pink-700',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
};

const getStatusLabel = (status: string) => {
  const labels = {
    'da-fare': 'Da fare',
    'in-corso': 'In corso',
    completato: 'Completato',
    'in-attesa': 'In attesa',
    bloccato: 'Bloccato',
    posticipato: 'Posticipato',
    deroga: 'Deroga',
    ritardo: 'Ritardo',
  };
  return labels[status as keyof typeof labels] || status;
};

const getPriorityColor = (priority: string) => {
  const colors = {
    low: 'bg-green-100 text-green-700 border-green-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    high: 'bg-orange-100 text-orange-700 border-orange-300',
    critical: 'bg-red-100 text-red-700 border-red-300',
  };
  return colors[priority as keyof typeof colors];
};

const getProgressColor = (progress: number) => {
  if (progress < 30) return 'bg-red-500';
  if (progress < 70) return 'bg-yellow-500';
  return 'bg-green-500';
};

const calculateWorkingDays = (startDate: Date, endDate: Date) => {
  let count = 0;
  const current = new Date(startDate);

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
};

const getRemainingWorkingDays = (endDate: string) => {
  const today = new Date();
  const end = new Date(endDate);

  if (end < today) return 0;

  return calculateWorkingDays(today, end);
};

const getTotalDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<
    'dashboard' | 'projects' | 'team' | 'timeline' | 'metrics'
  >('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : generateRealData().projects;
  });

  const [developers, setDevelopers] = useState<Developer[]>(() => {
    const saved = localStorage.getItem('developers');
    return saved ? JSON.parse(saved) : generateRealData().developers;
  });

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('developers', JSON.stringify(developers));
  }, [developers]);

  const ProjectModal = ({
    project,
    onClose,
    onSave,
  }: {
    project: Project | null;
    onClose: () => void;
    onSave: (project: Project) => void;
  }) => {
    const [formData, setFormData] = useState<Project>(
      project || {
        id: 'p' + Date.now(),
        name: '',
        owner: 'L.Rossetti',
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

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
      onClose();
    };

    const owners = [
      'L.Rossetti',
      'L.Frangella',
      'C.Tedesco',
      'F.Patacconi',
      'P.Epifania',
      'M.Massarotto',
      'C&L',
      'A.Rago',
      'Tutti',
    ];
    const statuses = [
      'da-fare',
      'in-corso',
      'completato',
      'in-attesa',
      'bloccato',
      'posticipato',
      'deroga',
      'ritardo',
    ];

    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
        <div
          className={`${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
        >
          <div className='p-6 border-b border-gray-200'>
            <div className='flex justify-between items-center'>
              <h2 className='text-2xl font-bold'>
                {project ? 'Modifica Progetto' : 'Nuovo Progetto'}
              </h2>
              <button
                onClick={onClose}
                className='p-2 hover:bg-gray-100 rounded'
              >
                <X className='w-6 h-6' />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='p-6 space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold mb-2'>
                  Nome Progetto *
                </label>
                <input
                  type='text'
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className='block text-sm font-semibold mb-2'>
                  Owner *
                </label>
                <select
                  value={formData.owner}
                  onChange={(e) =>
                    setFormData({ ...formData, owner: e.target.value })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {owners.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className='block text-sm font-semibold mb-2'>
                Descrizione
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold mb-2'>
                  Data Inizio *
                </label>
                <input
                  type='date'
                  required
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className='block text-sm font-semibold mb-2'>
                  Data Scadenza *
                </label>
                <input
                  type='date'
                  required
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold mb-2'>
                  Stato *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-semibold mb-2'>
                  Priorità *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as any,
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value='low'>Bassa</option>
                  <option value='medium'>Media</option>
                  <option value='high'>Alta</option>
                  <option value='critical'>Critica</option>
                </select>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold mb-2'>
                  Progress % (0-100)
                </label>
                <input
                  type='number'
                  min='0'
                  max='100'
                  value={formData.progress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      progress: parseInt(e.target.value) || 0,
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className='block text-sm font-semibold mb-2'>
                  Stima Giorni
                </label>
                <input
                  type='number'
                  min='0'
                  value={formData.estimatedDays}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedDays: parseInt(e.target.value) || 0,
                    })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-semibold mb-2'>
                Assegna Developers
              </label>
              <div className='grid grid-cols-2 gap-2'>
                {developers.map((dev) => (
                  <label key={dev.id} className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={formData.assignedDevs.includes(dev.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            assignedDevs: [...formData.assignedDevs, dev.id],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            assignedDevs: formData.assignedDevs.filter(
                              (id) => id !== dev.id
                            ),
                          });
                        }
                      }}
                      className='rounded'
                    />
                    <span className='text-sm'>{dev.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className='flex justify-end gap-3 pt-4 border-t border-gray-200'>
              <button
                type='button'
                onClick={onClose}
                className={`px-6 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Annulla
              </button>
              <button
                type='submit'
                className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2'
              >
                <Save className='w-4 h-4' />
                Salva
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    const activeProjects = projects.filter(
      (p) => p.status === 'in-corso'
    ).length;
    const completedProjects = projects.filter(
      (p) => p.status === 'completato'
    ).length;
    const blockedProjects = projects.filter(
      (p) => p.status === 'bloccato'
    ).length;
    const avgProgress = Math.round(
      projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
    );

    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } p-6 rounded-lg shadow-md`}
          >
            <div className='flex items-center justify-between'>
              <div>
                <p
                  className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  In Corso
                </p>
                <p className='text-3xl font-bold mt-2'>{activeProjects}</p>
              </div>
              <FolderKanban className='w-12 h-12 text-blue-500 opacity-20' />
            </div>
          </div>

          <div
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } p-6 rounded-lg shadow-md`}
          >
            <div className='flex items-center justify-between'>
              <div>
                <p
                  className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Completati
                </p>
                <p className='text-3xl font-bold mt-2'>{completedProjects}</p>
              </div>
              <CheckCircle2 className='w-12 h-12 text-green-500 opacity-20' />
            </div>
          </div>

          <div
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } p-6 rounded-lg shadow-md`}
          >
            <div className='flex items-center justify-between'>
              <div>
                <p
                  className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Bloccati
                </p>
                <p className='text-3xl font-bold mt-2 text-red-500'>
                  {blockedProjects}
                </p>
              </div>
              <AlertCircle className='w-12 h-12 text-red-500 opacity-20' />
            </div>
          </div>

          <div
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } p-6 rounded-lg shadow-md`}
          >
            <div className='flex items-center justify-between'>
              <div>
                <p
                  className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Progress Medio
                </p>
                <p className='text-3xl font-bold mt-2'>{avgProgress}%</p>
              </div>
              <Target className='w-12 h-12 text-purple-500 opacity-20' />
            </div>
          </div>
        </div>

        <div
          className={`${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className='text-lg font-semibold mb-4'>Progetti Recenti</h3>
          <div className='space-y-3'>
            {projects.slice(0, 6).map((project) => {
              const totalDays = getTotalDays(
                project.startDate,
                project.endDate
              );
              const remainingDays = getRemainingWorkingDays(project.endDate);
              return (
                <div
                  key={project.id}
                  className={`p-4 rounded-lg border ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <div className='flex justify-between items-start'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-2 flex-wrap'>
                        <h4 className='font-semibold'>{project.name}</h4>
                        <span
                          className={`text-xs px-2 py-1 rounded ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {getStatusLabel(project.status)}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        } mb-2`}
                      >
                        Owner: {project.owner}
                      </p>
                      <div className='flex items-center gap-4 text-sm flex-wrap'>
                        <span>Tot: {totalDays}gg</span>
                        <span>Stima: {project.estimatedDays}gg</span>
                        <span
                          className={
                            remainingDays > 10
                              ? 'text-green-500'
                              : remainingDays > 0
                              ? 'text-yellow-500'
                              : 'text-red-500'
                          }
                        >
                          Gg lav. rim.: {remainingDays}
                        </span>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-2xl font-bold'>
                        {project.progress}%
                      </div>
                      <div className='w-24 bg-gray-200 rounded-full h-2 mt-1'>
                        <div
                          className={`h-2 rounded-full ${getProgressColor(
                            project.progress
                          )}`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const Projects = () => {
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterOwner, setFilterOwner] = useState('all');

    const filteredProjects = projects.filter((p) => {
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
      const matchesOwner = filterOwner === 'all' || p.owner === filterOwner;
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesStatus && matchesOwner && matchesSearch;
    });

    const owners = [
      'L.Rossetti',
      'L.Frangella',
      'C.Tedesco',
      'F.Patacconi',
      'P.Epifania',
      'M.Massarotto',
      'C&L',
      'A.Rago',
      'Tutti',
    ];
    const statuses = [
      'da-fare',
      'in-corso',
      'completato',
      'in-attesa',
      'bloccato',
      'posticipato',
      'deroga',
      'ritardo',
    ];

    return (
      <div className='space-y-6'>
        <div
          className={`${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } p-4 rounded-lg shadow-md`}
        >
          <div className='flex flex-wrap gap-4 items-center'>
            <div className='flex-1 min-w-[200px]'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='Cerca progetto...'
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-300'
                  }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <select
              className={`px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value='all'>Tutti gli stati</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
            <select
              className={`px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
            >
              <option value='all'>Tutti gli owner</option>
              {owners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2'
            >
              <Plus className='w-4 h-4' /> Nuovo
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4'>
          {filteredProjects.map((project) => {
            const totalDays = getTotalDays(project.startDate, project.endDate);
            const remainingDays = getRemainingWorkingDays(project.endDate);

            return (
              <div
                key={project.id}
                className={`${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } rounded-lg shadow-md p-6`}
              >
                <div className='flex flex-col lg:flex-row gap-6'>
                  <div className='flex-1'>
                    <div className='flex items-start justify-between mb-3'>
                      <div>
                        <h3 className='font-bold text-xl mb-2'>
                          {project.name}
                        </h3>
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
                      <div className='flex gap-2'>
                        <button
                          onClick={() => {
                            setEditingProject(project);
                            setShowAddModal(true);
                          }}
                          className='p-2 hover:bg-gray-200 rounded'
                        >
                          <Edit2 className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Eliminare questo progetto?')) {
                              setProjects(
                                projects.filter((p) => p.id !== project.id)
                              );
                            }
                          }}
                          className='p-2 hover:bg-red-100 text-red-500 rounded'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                      <div>
                        <p className='text-xs text-gray-500'>Owner</p>
                        <p className='font-semibold'>{project.owner}</p>
                      </div>
                      <div>
                        <p className='text-xs text-gray-500'>Tot Giorni</p>
                        <p className='font-semibold'>{totalDays}gg</p>
                      </div>
                      <div>
                        <p className='text-xs text-gray-500'>Stima</p>
                        <p className='font-semibold'>
                          {project.estimatedDays}gg
                        </p>
                      </div>
                      <div>
                        <p className='text-xs text-gray-500'>Gg Lav. Rim.</p>
                        <p
                          className={`font-semibold ${
                            remainingDays > 10
                              ? 'text-green-500'
                              : remainingDays > 0
                              ? 'text-yellow-500'
                              : 'text-red-500'
                          }`}
                        >
                          {remainingDays}gg
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='lg:w-48 flex flex-col justify-center items-center'>
                    <div className='text-5xl font-bold mb-2'>
                      {project.progress}%
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-4'>
                      <div
                        className={`h-4 rounded-full ${getProgressColor(
                          project.progress
                        )}`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const Team = () => {
    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {developers.map((dev) => {
            const utilization = (dev.allocatedHours / dev.weeklyHours) * 100;

            return (
              <div
                key={dev.id}
                className={`${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } rounded-lg shadow-md p-6`}
              >
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold'>
                    {dev.name.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className='font-bold'>{dev.name}</h3>
                    <p className='text-sm text-gray-500'>{dev.role}</p>
                  </div>
                </div>

                <div className='mb-3'>
                  <div className='flex justify-between mb-1'>
                    <span className='text-sm'>Utilizzo</span>
                    <span className='font-bold'>{utilization.toFixed(0)}%</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-3'>
                    <div
                      className={`h-3 rounded-full ${getProgressColor(
                        utilization
                      )}`}
                      style={{ width: `${utilization}%` }}
                    ></div>
                  </div>
                </div>

                <p className='text-sm text-gray-500'>
                  Progetti: {dev.projects.length}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const Timeline = () => {
    return (
      <div
        className={`${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } p-6 rounded-lg shadow-md`}
      >
        <h3 className='text-lg font-semibold mb-4'>Timeline</h3>
        <p className='text-gray-500'>Vista timeline in sviluppo...</p>
      </div>
    );
  };

  const Metrics = () => {
    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } p-6 rounded-lg shadow-md`}
          >
            <h3 className='text-lg font-semibold mb-4'>
              Distribuzione per Stato
            </h3>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: 'In corso',
                      value: projects.filter((p) => p.status === 'in-corso')
                        .length,
                    },
                    {
                      name: 'Completato',
                      value: projects.filter((p) => p.status === 'completato')
                        .length,
                    },
                    {
                      name: 'Da fare',
                      value: projects.filter((p) => p.status === 'da-fare')
                        .length,
                    },
                    {
                      name: 'Bloccato',
                      value: projects.filter((p) => p.status === 'bloccato')
                        .length,
                    },
                    {
                      name: 'Posticipato',
                      value: projects.filter((p) => p.status === 'posticipato')
                        .length,
                    },
                  ]}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  dataKey='value'
                >
                  <Cell fill='#3B82F6' />
                  <Cell fill='#10B981' />
                  <Cell fill='#6B7280' />
                  <Cell fill='#EF4444' />
                  <Cell fill='#8B5CF6' />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div
            className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } p-6 rounded-lg shadow-md`}
          >
            <h3 className='text-lg font-semibold mb-4'>Statistiche</h3>
            <div className='space-y-4'>
              <div className='flex justify-between p-3 rounded bg-gray-50'>
                <span>Totale Progetti</span>
                <span className='font-bold text-2xl'>{projects.length}</span>
              </div>
              <div className='flex justify-between p-3 rounded bg-green-50'>
                <span>Completati</span>
                <span className='font-bold text-2xl text-green-600'>
                  {projects.filter((p) => p.status === 'completato').length}
                </span>
              </div>
              <div className='flex justify-between p-3 rounded bg-blue-50'>
                <span>In Corso</span>
                <span className='font-bold text-2xl text-blue-600'>
                  {projects.filter((p) => p.status === 'in-corso').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <Projects />;
      case 'team':
        return <Team />;
      case 'timeline':
        return <Timeline />;
      case 'metrics':
        return <Metrics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <header
        className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-b sticky top-0 z-50`}
      >
        <div className='max-w-7xl mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <button
                className='lg:hidden'
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className='w-6 h-6' />
              </button>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                  <FolderKanban className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h1 className='text-xl font-bold'>ProjectHub</h1>
                  <p className='text-xs text-gray-500'>Gestione Progetti</p>
                </div>
              </div>
            </div>

            <nav className='hidden lg:flex items-center gap-1'>
              {[
                {
                  page: 'dashboard',
                  icon: LayoutDashboard,
                  label: 'Dashboard',
                },
                { page: 'projects', icon: FolderKanban, label: 'Progetti' },
                { page: 'team', icon: Users, label: 'Team' },
                { page: 'timeline', icon: Calendar, label: 'Timeline' },
                { page: 'metrics', icon: BarChart3, label: 'Metriche' },
              ].map(({ page, icon: Icon, label }) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : darkMode
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Icon className='w-4 h-4' />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            <div className='flex items-center gap-2'>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                {darkMode ? (
                  <Sun className='w-5 h-5' />
                ) : (
                  <Moon className='w-5 h-5' />
                )}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2'
              >
                <Plus className='w-4 h-4' />
                <span className='hidden md:inline'>Nuovo</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <div className='fixed inset-0 z-40 lg:hidden'>
          <div
            className='absolute inset-0 bg-black opacity-50'
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div
            className={`absolute left-0 top-0 bottom-0 w-64 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-xl p-6`}
          >
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-lg font-bold'>Menu</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className='w-6 h-6' />
              </button>
            </div>
            <nav className='space-y-2'>
              {[
                {
                  page: 'dashboard',
                  icon: LayoutDashboard,
                  label: 'Dashboard',
                },
                { page: 'projects', icon: FolderKanban, label: 'Progetti' },
                { page: 'team', icon: Users, label: 'Team' },
                { page: 'timeline', icon: Calendar, label: 'Timeline' },
                { page: 'metrics', icon: BarChart3, label: 'Metriche' },
              ].map(({ page, icon: Icon, label }) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page as any);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : darkMode
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Icon className='w-5 h-5' />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <main className='max-w-7xl mx-auto px-4 py-6'>{renderPage()}</main>

      {showAddModal && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setShowAddModal(false);
            setEditingProject(null);
          }}
          onSave={(project) => {
            if (editingProject) {
              setProjects(
                projects.map((p) => (p.id === project.id ? project : p))
              );
            } else {
              setProjects([...projects, project]);
            }
            setEditingProject(null);
          }}
        />
      )}

      <footer
        className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-t mt-12`}
      >
        <div className='max-w-7xl mx-auto px-4 py-6'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-sm text-gray-500'>© 2025 ProjectHub</p>
            <button
              onClick={() => {
                if (confirm('Reset dati?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className='text-blue-500 hover:underline text-sm'
            >
              Reset Demo Data
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
