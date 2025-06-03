import { ref } from 'vue'

export const useSound = () => {
  const audioContext = ref(null)
  const audioElement = ref(null)
  const isSoundEnabled = ref(false)

  const initializeAudio = async () => {
    try {
      // Request audio permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop()) // Stop the stream after getting permission
      isSoundEnabled.value = true
      
      // Create audio context
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
      audioElement.value = new Audio()
    } catch (error) {
      console.warn('Audio permission denied:', error)
      isSoundEnabled.value = false
    }
  }

  const playSound = async (soundName) => {
    if (!isSoundEnabled.value) {
      initializeAudio()
      return
    }

    if (audioElement.value) {
      try {
        // Import the sound file dynamically
        const soundModule = await import(`../assets/sound/${soundName}.mp3`)
        audioElement.value.src = soundModule.default
        await audioElement.value.play()
      } catch (error) {
        console.warn('Error playing sound:', error)
      }
    }
  }

  return {
    playSound,
    isSoundEnabled,
    initializeAudio
  }
} 