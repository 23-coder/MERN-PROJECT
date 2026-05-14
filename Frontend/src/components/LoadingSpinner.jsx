import React from 'react'

const LoadingSpinner = ({ fullPage = false }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...(fullPage ? { height: '100vh' } : { padding: '40px' })
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid #f0f0f0',
      borderTop: '3px solid #ff0000',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

export default LoadingSpinner
