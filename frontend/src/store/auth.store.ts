import { create } from 'zustand'

interface AuthStore {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
}

const initialToken =
  typeof window !== 'undefined' ? localStorage.getItem('token') : null

export const useAuthStore = create<AuthStore>((set) => ({
  token: initialToken,
  setToken: (token) => {
    localStorage.setItem('token', token)
    set({ token })
  },
  clearToken: () => {
    localStorage.removeItem('token')
    set({ token: null })
  }
}))