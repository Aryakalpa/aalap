import React from 'react';
export default class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
        <div style={{height:'100vh', display:'grid', placeItems:'center', background:'var(--bg-primary)', color:'var(--danger)'}}>
            <div style={{textAlign:'center'}}>
                <h2>Error loading content.</h2>
                <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
            </div>
        </div>
    );
    return this.props.children;
  }
}