import { defineStore } from 'pinia'

interface AppState {
  sidebar: {
    opened: boolean
  }
  device: 'desktop' | 'mobile'
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebar: {
      opened: true
    },
    device: 'desktop'
  }),

  actions: {
    toggleSidebar() {
      this.sidebar.opened = !this.sidebar.opened
    },

    closeSidebar() {
      this.sidebar.opened = false
    },

    setDevice(device: 'desktop' | 'mobile') {
      this.device = device
    }
  }
})
