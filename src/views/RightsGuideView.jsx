import React, { useState, useEffect } from 'react'
import { Book, Globe, ChevronDown, ChevronUp, Lock } from 'lucide-react'
import InfoCard from '../components/InfoCard'
import CallToActionButton from '../components/CallToActionButton'
import { generateStateSpecificGuide, generateMultilingualScript } from '../utils/contentGeneration'

const RightsGuideView = ({ user, setUser }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(user.preferredLanguage)
  const [expandedSections, setExpandedSections] = useState({})
  const [rightsGuide, setRightsGuide] = useState(null)
  const [scripts, setScripts] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const guide = await generateStateSpecificGuide(user.state, selectedLanguage)
        const scriptContent = await generateMultilingualScript(selectedLanguage)
        setRightsGuide(guide)
        setScripts(scriptContent)
      } catch (error) {
        console.error('Failed to load content:', error)
        // Fallback content
        setRightsGuide(getDefaultRightsGuide(user.state))
        setScripts(getDefaultScripts(selectedLanguage))
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [user.state, selectedLanguage])

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Loading rights guide...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <InfoCard
        variant="stateGuide"
        title={`Your Rights in ${user.state}`}
        content={
          <div className="space-y-4">
            <p className="text-white/80">
              State-specific guidance for police interactions. Know your rights and stay protected.
            </p>
            
            <div className="flex items-center space-x-4">
              <Globe className="h-5 w-5 text-accent" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-accent"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-purple-800">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        }
        icon={Book}
      />

      {/* Core Rights */}
      <InfoCard
        title="Your Core Rights"
        content={
          <div className="space-y-4">
            {rightsGuide?.coreRights?.map((right, index) => (
              <div key={index} className="border-l-2 border-accent pl-4">
                <h4 className="font-semibold text-white mb-2">{right.title}</h4>
                <p className="text-white/80">{right.description}</p>
              </div>
            ))}
          </div>
        }
      />

      {/* What to Say/Not Say */}
      <InfoCard
        title="Communication Scripts"
        content={
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-400">✓ What TO Say:</h4>
              {scripts?.recommended?.map((script, index) => (
                <div key={index} className="bg-green-900/20 p-3 rounded border-l-2 border-green-400">
                  <p className="text-white/90 italic">"{script}"</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-red-400">✗ What NOT to Say:</h4>
              {scripts?.avoid?.map((script, index) => (
                <div key={index} className="bg-red-900/20 p-3 rounded border-l-2 border-red-400">
                  <p className="text-white/90 italic">"{script}"</p>
                </div>
              ))}
            </div>
          </div>
        }
      />

      {/* Advanced Scenarios (Premium) */}
      {user.subscriptionStatus === 'premium' ? (
        <InfoCard
          title="Advanced Scenarios"
          content={
            <div className="space-y-4">
              {rightsGuide?.scenarios?.map((scenario, index) => {
                const isExpanded = expandedSections[`scenario-${index}`]
                return (
                  <div key={index} className="border border-white/20 rounded-lg p-4">
                    <button
                      onClick={() => toggleSection(`scenario-${index}`)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <h4 className="font-semibold text-white">{scenario.title}</h4>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-accent" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-accent" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <p className="text-white/80 mb-3">{scenario.description}</p>
                        <div className="space-y-2">
                          <h5 className="font-medium text-accent">Recommended Actions:</h5>
                          <ul className="space-y-1">
                            {scenario.actions?.map((action, actionIndex) => (
                              <li key={actionIndex} className="text-white/80 flex items-start space-x-2">
                                <span className="text-accent">•</span>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          }
        />
      ) : (
        <InfoCard
          variant="premium"
          title="Advanced Scenarios"
          content={
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-white/60">
                <Lock className="h-5 w-5" />
                <p>Unlock detailed scenarios for traffic stops, searches, arrests, and more</p>
              </div>
              <CallToActionButton
                variant="premium"
                onClick={() => setUser(prev => ({ ...prev, subscriptionStatus: 'premium' }))}
              >
                Upgrade to Premium
              </CallToActionButton>
            </div>
          }
        />
      )}
    </div>
  )
}

// Fallback content for when API fails
const getDefaultRightsGuide = (state) => ({
  coreRights: [
    {
      title: "Right to Remain Silent",
      description: "You have the constitutional right to remain silent. You are not required to answer questions beyond providing identification when legally required."
    },
    {
      title: "Right to Refuse Searches",
      description: "You can refuse consent to search your person, belongings, or vehicle unless the officer has a warrant or probable cause."
    },
    {
      title: "Right to Record",
      description: "In most situations, you have the right to record police interactions in public spaces, as long as you don't interfere with their duties."
    },
    {
      title: "Right to an Attorney",
      description: "If arrested, you have the right to an attorney. If you cannot afford one, one will be appointed for you."
    }
  ],
  scenarios: [
    {
      title: "Traffic Stop",
      description: "What to do when pulled over by police",
      actions: [
        "Pull over safely and turn off engine",
        "Keep hands visible on steering wheel",
        "Provide license, registration, and insurance when asked",
        "Remain calm and polite"
      ]
    },
    {
      title: "Home Visit",
      description: "When police come to your door",
      actions: [
        "You don't have to open the door without a warrant",
        "Ask to see the warrant through the door",
        "If no warrant, you can refuse entry",
        "Step outside and close door if you choose to speak"
      ]
    }
  ]
})

const getDefaultScripts = (language) => {
  if (language === 'es') {
    return {
      recommended: [
        "Tengo derecho a permanecer en silencio",
        "No consiento a ninguna búsqueda",
        "Quiero hablar con un abogado",
        "¿Estoy libre para irme?"
      ],
      avoid: [
        "No hice nada malo",
        "Solo busque en mi teléfono",
        "No tengo nada que esconder",
        "¿Cuál es el problema?"
      ]
    }
  }
  
  return {
    recommended: [
      "I am exercising my right to remain silent",
      "I do not consent to any searches",
      "I want to speak to a lawyer",
      "Am I free to leave?"
    ],
    avoid: [
      "I didn't do anything wrong",
      "Just search my phone",
      "I have nothing to hide",
      "What's the problem?"
    ]
  }
}

export default RightsGuideView