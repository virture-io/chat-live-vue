<template>
  <div class="widget-container">
    <div v-if="!isSoundEnabled" class="sound-permission-banner">
      <p>Para una mejor experiencia, permita el acceso al audio</p>
      <button @click="requestSoundPermission">Permitir Audio</button>
    </div>
    <!-- Add your widget content here -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { socketConnection } from '../../composable/socket-connection'
import { useSound } from '../../composable/useSound'

const props = defineProps({
  socketUrl: {
    type: String,
    required: true
  },
  idAgent: {
    type: String,
    required: true
  },
  apiKey: {
    type: String,
    default: ''
  },
  nameSpace: {
    type: String,
    default: '/'
  },
  soundName: {
    type: String,
    default: 'sound1'
  }
})

const { isSoundEnabled, initializeAudio } = useSound()

const requestSoundPermission = async () => {
  await initializeAudio()
}

onMounted(() => {
  socketConnection(
    props.socketUrl,
    props.idAgent,
    props.apiKey,
    props.nameSpace,
    props.soundName
  )
})
</script>

<style scoped>
.widget-container {
  position: relative;
}

.sound-permission-banner {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 8px;
  z-index: 1000;
}

.sound-permission-banner button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
}

.sound-permission-banner button:hover {
  background: #45a049;
}
</style> 