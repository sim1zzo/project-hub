// components/ErrorBoundary.tsx - Componente per gestione errori React

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Qui potresti inviare l'errore a un servizio di logging
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
          <div className='max-w-md w-full bg-white rounded-lg shadow-xl p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-3 bg-red-100 rounded-full'>
                <AlertCircle className='w-6 h-6 text-red-600' />
              </div>
              <h1 className='text-xl font-bold text-gray-900'>
                Ops! Qualcosa è andato storto
              </h1>
            </div>

            <p className='text-gray-600 mb-4'>
              Si è verificato un errore imprevisto. Puoi provare a ricaricare la
              pagina o contattare il supporto se il problema persiste.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className='mb-4 p-4 bg-gray-100 rounded-lg'>
                <p className='text-sm font-semibold text-gray-700 mb-2'>
                  Dettagli errore (solo sviluppo):
                </p>
                <p className='text-xs text-red-600 font-mono mb-2'>
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className='text-xs text-gray-600'>
                    <summary className='cursor-pointer'>Stack trace</summary>
                    <pre className='mt-2 overflow-auto'>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className='flex gap-3'>
              <button
                onClick={this.handleReset}
                className='flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2'
              >
                <RefreshCw className='w-4 h-4' />
                Riprova
              </button>
              <button
                onClick={() => window.location.reload()}
                className='flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'
              >
                Ricarica Pagina
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
