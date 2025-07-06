import { ref } from 'vue'

export const useSound = () => {
  const isSoundEnabled = ref(false)

  // Habilitar sonido cuando el usuario lo permita
  const enableSound = () => {
    isSoundEnabled.value = true
  }

  const playSound = async (soundName, volume = 1.0) => {
    if (!isSoundEnabled.value) {
      console.log('El usuario no ha aceptado recibir sonidos.')
      return
    }
    try {
      const audio = new Audio()
      audio.volume = volume
      const soundModule = await import(`../assets/sound/${soundName}.mp3`)
      audio.src = soundModule.default
      await audio.play()
    } catch (error) {
      console.warn('Error al reproducir sonido:', error)
    }
  }

  return {
    playSound,
    isSoundEnabled,
    enableSound
  }
} 