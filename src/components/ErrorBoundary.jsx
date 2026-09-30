import React from 'react';

/**
 * Catches render-time errors anywhere in the tree and shows a recoverable
 * message instead of a blank white screen. Includes a button to clear the
 * persisted VitaSync store, which resolves crashes caused by stale/corrupt
 * localStorage data.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('VitaSync render error:', error, info);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('vitasync.patients.v1');
      localStorage.removeItem('vitasync.activePatientId.v1');
    } catch {
      // ignore
    }
    window.location.hash = '#/';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] px-6 text-center">
          <h1 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h1>
          <p className="text-slate-500 max-w-md mb-5 text-sm">
            The app hit an unexpected error. Resetting local data usually fixes it.
          </p>
          <pre className="max-w-lg overflow-auto text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3 mb-5 text-left">
            {String(this.state.error)}
          </pre>
          <button
            onClick={this.handleReset}
            className="px-5 py-2.5 bg-[#0B192C] text-amber-300 font-bold rounded-xl hover:bg-[#1E3E62] transition-all"
          >
            Reset & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
