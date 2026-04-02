import * as React from "react";

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    (this as any).state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    const state = (this as any).state as State;
    const props = (this as any).props as Props;

    if (state.hasError) {
      return (
        <div className="min-h-screen bg-ink flex items-center justify-center p-8 text-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-serif text-gold mb-4">Something went wrong.</h1>
            <p className="text-paper/60 mb-8">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gold text-ink font-bold uppercase tracking-widest rounded-full hover:bg-gold-light transition-all"
            >
              Refresh Page
            </button>
            {state.error && (
              <pre className="mt-8 p-4 bg-white/5 rounded-xl text-left text-[10px] text-red-400 overflow-auto max-h-40">
                {state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return props.children;
  }
}

export default ErrorBoundary;
