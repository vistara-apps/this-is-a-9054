import React from 'react'

const InfoCard = ({ variant = 'default', title, content, icon: Icon, onClick, className = '' }) => {
  const variantStyles = {
    default: 'bg-surface/10 backdrop-blur-md border border-white/20',
    stateGuide: 'bg-surface/15 backdrop-blur-md border border-accent/30',
    script: 'bg-surface/10 backdrop-blur-md border border-white/20',
    premium: 'bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30'
  }

  return (
    <div 
      className={`card ${variantStyles[variant]} text-white ${onClick ? 'cursor-pointer hover:bg-white/5 transition-colors duration-200' : ''} ${className}`}
      onClick={onClick}
    >
      {Icon && (
        <div className="flex items-center space-x-3 mb-4">
          <Icon className="h-6 w-6 text-accent" />
          <h3 className="text-heading">{title}</h3>
        </div>
      )}
      {!Icon && title && (
        <h3 className="text-heading mb-4">{title}</h3>
      )}
      
      {typeof content === 'string' ? (
        <p className="text-body text-white/80">{content}</p>
      ) : (
        content
      )}
    </div>
  )
}

export default InfoCard