import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorInfo: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorInfo: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let displayMessage = "An unexpected error occurred.";
      try {
        const parsed = JSON.parse(this.state.errorInfo || "");
        if (parsed.error && parsed.error.includes("Missing or insufficient permissions")) {
          displayMessage = "You do not have permission to perform this action or view this data.";
        }
      } catch (e) {
        // Not JSON, use default or raw message
        if (this.state.errorInfo) displayMessage = this.state.errorInfo;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#030014]">
          <div className="glass p-8 md:p-12 rounded-[2rem] max-w-lg w-full text-center border border-white/10">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-4">Something went wrong</h2>
            <p className="text-white/60 mb-8 text-sm leading-relaxed">
              {displayMessage}
            </p>
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-8 py-4 glass-button text-white font-bold rounded-full hover:scale-105 transition-transform mx-auto"
            >
              <RefreshCcw className="w-5 h-5" /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
