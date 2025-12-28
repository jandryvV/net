import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTranslation } from './useTranslation'

export function useTextToSpeech() {
  const { locale } = useTranslation()
  const isSpeaking = ref(false)
  const isEnabled = ref<boolean>(localStorage.getItem('ttsEnabled') === 'true')
  const rate = ref<number>(parseFloat(localStorage.getItem('ttsRate') || '1'))
  const pitch = ref<number>(parseFloat(localStorage.getItem('ttsPitch') || '1'))
  const volume = ref<number>(parseFloat(localStorage.getItem('ttsVolume') || '1'))

  // Check if browser supports Speech Synthesis
  const isSupported = computed(() => 'speechSynthesis' in window)

  // Get available voices
  const getVoices = () => {
    return window.speechSynthesis.getVoices()
  }

  // Get voice for current language
  const getVoiceForLanguage = () => {
    const voices = getVoices()
    const lang = locale.value === 'es' ? 'es' : 'en'

    // Try to find a voice matching the current language
    let voice = voices.find((v) => v.lang.startsWith(lang))

    // Fallback to default voice
    if (!voice && voices.length > 0) {
      voice = voices[0]
    }

    return voice
  }

  // Speak text
  const speak = (text: string, options?: { rate?: number; pitch?: number; volume?: number }) => {
    if (!isSupported.value || !isEnabled.value || !text.trim()) return

    // Cancel any ongoing speech
    stop()

    const utterance = new SpeechSynthesisUtterance(text)
    const voice = getVoiceForLanguage()

    if (voice) {
      utterance.voice = voice
    }

    utterance.rate = options?.rate ?? rate.value
    utterance.pitch = options?.pitch ?? pitch.value
    utterance.volume = options?.volume ?? volume.value
    utterance.lang = locale.value === 'es' ? 'es-ES' : 'en-US'

    utterance.onstart = () => {
      isSpeaking.value = true
    }

    utterance.onend = () => {
      isSpeaking.value = false
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event)
      isSpeaking.value = false
    }

    window.speechSynthesis.speak(utterance)
  }

  // Stop speaking
  const stop = () => {
    if (isSupported.value) {
      window.speechSynthesis.cancel()
      isSpeaking.value = false
    }
  }

  // Pause speaking
  const pause = () => {
    if (isSupported.value && isSpeaking.value) {
      window.speechSynthesis.pause()
    }
  }

  // Resume speaking
  const resume = () => {
    if (isSupported.value) {
      window.speechSynthesis.resume()
    }
  }

  // Toggle TTS on/off
  const toggleEnabled = () => {
    isEnabled.value = !isEnabled.value
    localStorage.setItem('ttsEnabled', isEnabled.value.toString())

    if (!isEnabled.value) {
      stop()
    }
  }

  // Set TTS rate
  const setRate = (newRate: number) => {
    rate.value = Math.max(0.1, Math.min(10, newRate))
    localStorage.setItem('ttsRate', rate.value.toString())
  }

  // Set TTS pitch
  const setPitch = (newPitch: number) => {
    pitch.value = Math.max(0, Math.min(2, newPitch))
    localStorage.setItem('ttsPitch', pitch.value.toString())
  }

  // Set TTS volume
  const setVolume = (newVolume: number) => {
    volume.value = Math.max(0, Math.min(1, newVolume))
    localStorage.setItem('ttsVolume', volume.value.toString())
  }

  // Read element content
  const readElement = (element: HTMLElement) => {
    const text = element.textContent || element.innerText
    speak(text)
  }

  // Read selected text
  const readSelection = () => {
    const selection = window.getSelection()
    const text = selection?.toString()
    if (text) {
      speak(text)
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stop()
  })

  return {
    isSupported,
    isSpeaking,
    isEnabled,
    rate,
    pitch,
    volume,
    speak,
    stop,
    pause,
    resume,
    toggleEnabled,
    setRate,
    setPitch,
    setVolume,
    readElement,
    readSelection,
    getVoices,
  }
}
