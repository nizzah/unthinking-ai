/**
 * Error boundary component to catch and handle TLD URL errors
 */
"use client";

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Check if it's a TLD URL error
    if (error.message.includes('Unlisted TLDs in URLs are not supported')) {
      console.warn('TLD URL error caught and handled:', error.message);
      return { hasError: true, error };
    }
    
    // Re-throw other errors
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (error.message.includes('Unlisted TLDs in URLs are not supported')) {
      console.warn('TLD URL error in component:', error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }
      
      return (
        <div className="p-4 text-center">
          <p className="text-stone-400">Something went wrong. Please try again.</p>
          <button 
            onClick={this.resetError}
            className="mt-2 px-4 py-2 bg-coral-600 text-white rounded hover:bg-coral-700"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook to handle URL-related errors globally
 */
export function useUrlErrorHandler() {
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('Unlisted TLDs in URLs are not supported')) {
        console.warn('TLD URL error caught globally:', event.message);
        event.preventDefault(); // Prevent the error from showing in console
        return false;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('Unlisted TLDs in URLs are not supported')) {
        console.warn('TLD URL error in promise:', event.reason.message);
        event.preventDefault(); // Prevent the error from showing in console
        return false;
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}
