import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030014] flex items-center justify-center px-6">
          <div className="glass p-8 md:p-12 rounded-[2rem] text-center max-w-lg w-full border border-white/10">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 text-white">Something went wrong</h2>
            <p className="text-white/60 mb-8 text-sm md:text-base">
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </p>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 text-left">
              <p className="text-red-500 text-xs font-mono break-all">
                {this.state.error?.message}
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-4 glass-button text-white font-bold rounded-full hover:scale-105 transition-transform"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
