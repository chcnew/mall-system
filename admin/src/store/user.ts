import { defineStore } from 'pinia'
import { login as loginApi, logout as logoutApi, getUserInfo as getUserInfoApi } from '@/api/auth'

export interface User {
  id: number
  username: string
  nickname: string
  avatar?: string
  role: string
}

interface UserState {
  token: string
  user: User | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('admin_token') || '',
    user: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    async login(loginForm: { username: string; password: string }) {
      const data = await loginApi(loginForm)
      this.token = data.token
      this.user = data.admin
      localStorage.setItem('admin_token', data.token)
    },

    async getUserInfo() {
      const data = await getUserInfoApi()
      this.user = data
    },

    async logout() {
      await logoutApi()
      this.token = ''
      this.user = null
      localStorage.removeItem('admin_token')
    }
  }
})
