import { ref } from 'vue'

export const useSound = () => {
  const isSoundEnabled = ref(false)
  const audioContext = ref(null)

  const requestAudioPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      isSoundEnabled.value = true
      return true
    } catch (error) {
      console.warn('Permiso de audio denegado:', error)
      isSoundEnabled.value = false
      return false
    }
  }

  const initializeAudioContext = () => {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  const playSound = async (soundName, volume = 1.0) => {
    if (!isSoundEnabled.value) {
      const permissionGranted = await requestAudioPermission()
      if (!permissionGranted) return
    }

      try {
      // Crear una nueva instancia de Audio para cada reproducción
      const audio = new Audio()
      audio.volume = volume

      // Importar el archivo de sonido dinámicamente
        const soundModule = await import(`../assets/sound/${soundName}.mp3`)
      audio.src = soundModule.default

      // Limpiar recursos después de la reproducción
      audio.onended = () => {
        audio.remove()
      }

      // Manejar errores de reproducción
      audio.onerror = (error) => {
        console.warn('Error al reproducir sonido:', error)
        audio.remove()
      }

      await audio.play()
      } catch (error) {
      console.warn('Error al reproducir sonido:', error)
    }
  }

  return {
    playSound,
    isSoundEnabled,
    requestAudioPermission,
    initializeAudioContext
  }
} 