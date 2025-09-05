import React from 'react'

const CallToActionButton = ({ variant = 'default', children, onClick, disabled = false, className = '' }) => {
  const variantStyles = {
    default: 'btn-primary',
    record: 'bg-red-600 text-white hover:bg-red-700',
    alert: 'bg-orange-600 text-white hover:bg-orange-700',
    share: 'bg-green-600 text-white hover:bg-green-700',
    accent: 'btn-accent',
    premium: 'bg-gradient-to-r from-accent to-primary text-black hover:opacity-90'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className} px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2`}
    >
      {children}
    </button>
  )
}

export default CallToActionButton