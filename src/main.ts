import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

declare global {
  interface Window {
    NDEFReader: any;
  }
}

createApp(App).mount('#app')
