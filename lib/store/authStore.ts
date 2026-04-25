import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email?: string
  phone?: string
  name?: string
  role: string
}

interface AuthStore {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isModalOpen: boolean

  openModal: () => void
  closeModal: () => void
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  updateAccessToken: (accessToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isModalOpen: false,

      openModal: () => set({ isModalOpen: true }),
      closeModal: () => set({ isModalOpen: false }),
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isModalOpen: false }),
      updateAccessToken: (accessToken) => set({ accessToken }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'aavya-auth',
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
      }),
    }
  )
)
