import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("AALAP CRITICAL ERROR:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#FFF0F0', color: '#D8000C', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1>⚠️ Something went wrong.</h1>
          <h3 style={{ color: '#333' }}>Please send this to your developer:</h3>
          <div style={{ background: '#fff', padding: '20px', border: '1px solid #D8000C', borderRadius: '5px', overflowX: 'auto' }}>
            <strong>{this.state.error && this.state.error.toString()}</strong>
            <pre style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
               {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
          <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}