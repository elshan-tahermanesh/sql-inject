import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an uncaught runtime error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[400px] flex flex-col items-center justify-center font-sans text-center px-6 py-12 bg-cyber-black text-cyber-text">
          <div className="bg-cyber-card border border-cyber-border/70 rounded-2xl p-8 max-w-md w-full space-y-4 shadow-2xl relative overflow-hidden">
            <span className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-red" />
            <div className="flex justify-center">
              <span className="w-12 h-12 rounded-full bg-cyber-red/10 border border-cyber-red/30 flex items-center justify-center text-cyber-red text-xl font-bold font-mono">
                ⚠️
              </span>
            </div>
            <h3 className="font-sans font-extrabold text-lg text-cyber-title tracking-wider uppercase">
              Application Error
            </h3>
            <p className="text-sm text-cyber-dim leading-relaxed">
              This page could not be displayed.
              <br />
              Please return to the instructions page and try again.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.hash = '/instructions';
                }}
                className="inline-flex items-center gap-2 bg-cyber-blue hover:bg-cyber-blue-light text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md hover:shadow-lg"
              >
                Return to Instructions
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
