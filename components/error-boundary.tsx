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
    
    // Check if it's a browser extension error (suppress these)
    if (
      error.message.includes('runtime.lastError') ||
      error.message.includes('message port closed') ||
      error.message.includes('forward-logs-shared') ||
      error.message.includes('paywall-configuration-manager') ||
      error.message.includes('chrome-extension://') ||
      error.message.includes('net::ERR_FILE_NOT_FOUND') ||
      error.message.includes('completion_list.html') ||
      error.message.includes('Unlisted TLDs in URLs are not supported')
    ) {
      console.warn('Browser extension error suppressed:', error.message);
      return { hasError: false };
    }
    
    // Re-throw other errors
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (error.message.includes('Unlisted TLDs in URLs are not supported')) {
      console.warn('TLD URL error in component:', error, errorInfo);
    }
    
    // Suppress browser extension errors
    if (
      error.message.includes('runtime.lastError') ||
      error.message.includes('message port closed') ||
      error.message.includes('forward-logs-shared') ||
      error.message.includes('paywall-configuration-manager') ||
      error.message.includes('chrome-extension://') ||
      error.message.includes('net::ERR_FILE_NOT_FOUND') ||
      error.message.includes('completion_list.html') ||
      error.message.includes('Unlisted TLDs in URLs are not supported')
    ) {
      console.warn('Browser extension error suppressed in component:', error.message);
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
      const message = event.message || '';
      
      if (message.includes('Unlisted TLDs in URLs are not supported')) {
        console.warn('TLD URL error caught globally:', event.message);
        event.preventDefault(); // Prevent the error from showing in console
        return false;
      }
      
      // Suppress browser extension errors
      if (
        message.includes('runtime.lastError') ||
        message.includes('message port closed') ||
        message.includes('forward-logs-shared') ||
        message.includes('paywall-configuration-manager') ||
        message.includes('AuthContext') ||
        message.includes('chrome-extension://') ||
        message.includes('net::ERR_FILE_NOT_FOUND') ||
        message.includes('completion_list.html') ||
        message.includes('Unlisted TLDs in URLs are not supported')
      ) {
        console.warn('Browser extension error suppressed globally:', event.message);
        event.preventDefault();
        return false;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.message || event.reason?.toString() || '';
      
      if (reason.includes('Unlisted TLDs in URLs are not supported')) {
        console.warn('TLD URL error in promise:', reason);
        event.preventDefault(); // Prevent the error from showing in console
        return false;
      }
      
      // Suppress browser extension errors
      if (
        reason.includes('runtime.lastError') ||
        reason.includes('message port closed') ||
        reason.includes('forward-logs-shared') ||
        reason.includes('paywall-configuration-manager') ||
        reason.includes('AuthContext') ||
        reason.includes('chrome-extension://') ||
        reason.includes('net::ERR_FILE_NOT_FOUND') ||
        reason.includes('completion_list.html') ||
        reason.includes('Unlisted TLDs in URLs are not supported')
      ) {
        console.warn('Browser extension error suppressed in promise:', reason);
        event.preventDefault();
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
