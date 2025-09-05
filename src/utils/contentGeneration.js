// Content generation utilities using OpenAI

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''

// Note: In production, this should be handled server-side for security
export const generateStateSpecificGuide = async (state, language = 'en') => {
  try {
    // For demo purposes, we'll return mock data
    // In production, you'd call the OpenAI API here
    
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, using fallback content')
      return getFallbackGuide(state, language)
    }

    // OpenAI API call would go here
    // const response = await openai.chat.completions.create({...})
    
    return getFallbackGuide(state, language)
    
  } catch (error) {
    console.error('Error generating state guide:', error)
    return getFallbackGuide(state, language)
  }
}

export const generateMultilingualScript = async (language = 'en') => {
  try {
    // For demo purposes, we'll return mock data
    return getFallbackScripts(language)
    
  } catch (error) {
    console.error('Error generating scripts:', error)
    return getFallbackScripts(language)
  }
}

export const generateShareableCard = async (incidentType, location, state) => {
  try {
    const timestamp = new Date().toLocaleString()
    
    return {
      title: `Guardian Guide - ${incidentType}`,
      summary: `Incident documented on ${timestamp} in ${state}`,
      location: location ? `${location.latitude}, ${location.longitude}` : 'Unknown',
      keyRights: [
        'Right to remain silent',
        'Right to refuse searches',
        'Right to record interaction',
        'Right to an attorney'
      ],
      timestamp
    }
    
  } catch (error) {
    console.error('Error generating shareable card:', error)
    return null
  }
}

// Fallback content when API is not available
const getFallbackGuide = (state, language) => {
  const guides = {
    en: {
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
            "Remain calm and polite",
            "You may ask if you're free to leave"
          ]
        },
        {
          title: "Stop and Frisk",
          description: "When stopped on the street by police",
          actions: [
            "Stay calm and keep hands visible",
            "Ask 'Am I free to leave?'",
            "If detained, ask 'What is the reason for the stop?'",
            "You can refuse to consent to a search",
            "Don't resist even if you believe the stop is unlawful"
          ]
        },
        {
          title: "Home Visit",
          description: "When police come to your door",
          actions: [
            "You don't have to open the door without a warrant",
            "Ask to see the warrant through the door",
            "If no warrant, you can refuse entry",
            "Step outside and close door if you choose to speak",
            "Ask for the reason for their visit"
          ]
        }
      ]
    },
    es: {
      coreRights: [
        {
          title: "Derecho a Permanecer en Silencio",
          description: "Tienes el derecho constitucional de permanecer en silencio. No estás obligado a responder preguntas más allá de proporcionar identificación cuando sea legalmente requerido."
        },
        {
          title: "Derecho a Rechazar Búsquedas",
          description: "Puedes rechazar el consentimiento para registrar tu persona, pertenencias o vehículo a menos que el oficial tenga una orden o causa probable."
        },
        {
          title: "Derecho a Grabar",
          description: "En la mayoría de situaciones, tienes el derecho de grabar interacciones policiales en espacios públicos, siempre que no interfiera con sus deberes."
        },
        {
          title: "Derecho a un Abogado",
          description: "Si eres arrestado, tienes derecho a un abogado. Si no puedes pagar uno, se te asignará uno."
        }
      ],
      scenarios: [
        {
          title: "Parada de Tráfico",
          description: "Qué hacer cuando te detiene la policía",
          actions: [
            "Deténte de manera segura y apaga el motor",
            "Mantén las manos visibles en el volante",
            "Proporciona licencia, registro y seguro cuando se solicite",
            "Mantén la calma y sé cortés",
            "Puedes preguntar si eres libre de irte"
          ]
        }
      ]
    }
  }

  return guides[language] || guides.en
}

const getFallbackScripts = (language) => {
  const scripts = {
    en: {
      recommended: [
        "I am exercising my right to remain silent",
        "I do not consent to any searches",
        "I want to speak to a lawyer",
        "Am I free to leave?",
        "I am recording this interaction for legal documentation"
      ],
      avoid: [
        "I didn't do anything wrong",
        "Just search my phone",
        "I have nothing to hide",
        "What's the problem?",
        "This is harassment"
      ]
    },
    es: {
      recommended: [
        "Estoy ejerciendo mi derecho a permanecer en silencio",
        "No consiento a ninguna búsqueda",
        "Quiero hablar con un abogado",
        "¿Soy libre de irme?",
        "Estoy grabando esta interacción para documentación legal"
      ],
      avoid: [
        "No hice nada malo",
        "Solo busque en mi teléfono",
        "No tengo nada que esconder",
        "¿Cuál es el problema?",
        "Esto es acoso"
      ]
    }
  }

  return scripts[language] || scripts.en
}