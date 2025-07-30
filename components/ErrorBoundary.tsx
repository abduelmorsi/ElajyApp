import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorCount: number;
  lastErrorTime: number;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error | null; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
      lastErrorTime: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      lastErrorTime: Date.now()
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Special handling for DOM manipulation errors
    const isDOMError = error.message.includes('removeChild') || 
                      error.message.includes('Node') || 
                      error.message.includes('DOM') ||
                      error.message.includes('appendChild') ||
                      error.message.includes('insertBefore');
    
    if (isDOMError) {
      console.warn('DOM manipulation error detected, attempting recovery...');
      
      // For DOM errors, try immediate recovery if it's the first occurrence
      if (this.state.errorCount === 0) {
        this.scheduleAutoRecovery(1000); // Quick recovery for DOM errors
      } else if (this.state.errorCount < 2) {
        this.scheduleAutoRecovery(3000); // Slower recovery for repeated errors
      }
    }

    this.setState({
      error,
      errorInfo,
      errorCount: this.state.errorCount + 1
    });

    // Report error to monitoring service if available
    if (typeof window !== 'undefined' && (window as any).errorReporting) {
      (window as any).errorReporting.captureException(error, {
        extra: errorInfo,
        tags: {
          section: 'ErrorBoundary',
          errorType: this.categorizeError(error),
          isDOMError: isDOMError
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  categorizeError = (error: Error): string => {
    const message = error.message.toLowerCase();
    
    if (message.includes('removechild') || message.includes('node') || message.includes('dom')) {
      return 'dom-manipulation';
    }
    if (message.includes('network') || message.includes('fetch')) {
      return 'network';
    }
    if (message.includes('chunk') || message.includes('loading')) {
      return 'code-splitting';
    }
    if (message.includes('map') || message.includes('google')) {
      return 'maps-api';
    }
    if (message.includes('tab') || message.includes('radix')) {
      return 'ui-component';
    }
    
    return 'unknown';
  };

  scheduleAutoRecovery = (delay: number = 2000) => {
    // Only auto-recover certain types of errors and limit attempts
    if (this.state.errorCount < 3) {
      this.resetTimeoutId = window.setTimeout(() => {
        console.log('Attempting auto-recovery from error...');
        this.handleReset();
      }, delay);
    }
  };

  handleReset = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
      // Keep errorCount to track repeated issues
    });
  };

  handleForceRefresh = () => {
    // Clear all state and force full refresh
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
      lastErrorTime: 0
    });
    
    // Force re-render with a key change
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.handleReset} />;
      }

      // Default error UI
      const errorType = this.state.error ? this.categorizeError(this.state.error) : 'unknown';
      const isDOMError = errorType === 'dom-manipulation';
      const isUIError = errorType === 'ui-component';
      const isRecoverable = isDOMError || isUIError;

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-white border border-gray-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                {isRecoverable ? 'Display Issue Detected' : 'Something went wrong'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  {isRecoverable 
                    ? 'We encountered a temporary display issue. This usually resolves automatically.'
                    : 'An unexpected error occurred. Please try refreshing the page.'
                  }
                </p>
                
                {isRecoverable && this.state.errorCount < 3 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-700">
                      Auto-recovery in progress... (Attempt {this.state.errorCount + 1}/3)
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-1 mt-2">
                      <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Button 
                    onClick={this.handleReset}
                    className="w-full bg-primary text-white"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Try Again
                  </Button>
                  
                  {this.state.errorCount > 1 && (
                    <Button 
                      variant="outline"
                      onClick={this.handleForceRefresh}
                      className="w-full"
                    >
                      <Home size={16} className="mr-2" />
                      Restart App
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="w-full"
                  >
                    Refresh Page
                  </Button>
                </div>
              </div>

              {/* Error Information for Development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                    Error Details (Development)
                  </summary>
                  <div className="text-xs text-gray-600 space-y-2">
                    <div>
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    <div>
                      <strong>Type:</strong> {errorType}
                    </div>
                    <div>
                      <strong>Count:</strong> {this.state.errorCount}
                    </div>
                    <div>
                      <strong>Recoverable:</strong> {isRecoverable ? 'Yes' : 'No'}
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="mt-1 text-xs overflow-auto max-h-32 bg-white p-2 rounded border">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Help Text */}
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">
                  If this issue persists, please contact support or try refreshing your browser.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;