import React from 'react';
export default class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div style={{padding:40, textAlign:'center'}}>Something went wrong. Reloading... <button onClick={() => window.location.reload()}>Reload</button></div>;
    return this.props.children;
  }
}