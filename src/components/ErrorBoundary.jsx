import React from 'react';
export default class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div style={{padding:40,background:'#000',color:'red'}}>CRITICAL ERROR. RELOAD.</div>;
    return this.props.children;
  }
}