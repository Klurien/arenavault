import React from 'react'

export default class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  handleReload = () => {
    this.setState({ hasError: false }, () => {
      window.location.reload()
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          color: '#ddd',
          background: 'transparent',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <h2>Something went wrong</h2>
          <p>There was an issue loading the page chunk. This may be a temporary deploy race.</p>
          <button onClick={this.handleReload} style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid #ddd',
            color: '#ddd',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
