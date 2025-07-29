// Add styles for the error UI
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 24,
  },
  errorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  errorIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffe5e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  errorIcon: {
    fontSize: 36,
    color: '#e00',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e00',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDesc: {
    fontSize: 15,
    color: '#444',
    marginBottom: 16,
    textAlign: 'center',
  },
  recoveryBox: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  recoveryText: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
    textAlign: 'center',
  },
  recoveryBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  recoveryBarFill: {
    width: '60%',
    height: 8,
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
  tryAgainBtn: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
  },
  tryAgainBtnText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  helpBox: {
    marginTop: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 10,
    width: '100%',
  },
  helpText: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
  },
});

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
  lastErrorTime: number;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error | null; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
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

  componentDidCatch(error: Error) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error);
    this.setState({
      error,
      errorCount: this.state.errorCount + 1
    });
    // You can add custom error reporting here for React Native (e.g., Sentry, Bugsnag)
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  categorizeError = (error: Error): string => {
    const message = error.message.toLowerCase();
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
    // Only auto-recover and limit attempts
    if (this.state.errorCount < 3) {
      this.resetTimeoutId = setTimeout(() => {
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
      error: null
      // Keep errorCount to track repeated issues
    });
  };

  // handleForceRefresh removed for React Native (no window.location.reload)

  render() {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.handleReset} />;
      }

      // Default error UI
      const errorType = this.state.error ? this.categorizeError(this.state.error) : 'unknown';
      const isUIError = errorType === 'ui-component';
      const isRecoverable = isUIError;

      return (
        <View style={styles.centeredContainer}>
          <View style={styles.errorCard}>
            <View style={styles.errorIconBox}>
              <Text style={styles.errorIcon}>⚠️</Text>
            </View>
            <Text style={styles.errorTitle}>{isRecoverable ? 'Display Issue Detected' : 'Something went wrong'}</Text>
            <Text style={styles.errorDesc}>
              {isRecoverable
                ? 'We encountered a temporary display issue. This usually resolves automatically.'
                : 'An unexpected error occurred. Please try restarting the app.'}
            </Text>
            {isRecoverable && this.state.errorCount < 3 && (
              <View style={styles.recoveryBox}>
                <Text style={styles.recoveryText}>
                  Auto-recovery in progress... (Attempt {this.state.errorCount + 1}/3)
                </Text>
                <View style={styles.recoveryBarBg}>
                  <View style={styles.recoveryBarFill} />
                </View>
              </View>
            )}
            <TouchableOpacity style={styles.tryAgainBtn} onPress={this.handleReset}>
              <Text style={styles.tryAgainBtnText}>🔄 Try Again</Text>
            </TouchableOpacity>
            <View style={styles.helpBox}>
              <Text style={styles.helpText}>
                If this issue persists, please contact support or try restarting the app.
              </Text>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;