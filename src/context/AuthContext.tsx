import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser,
  type User,
} from 'firebase/auth'
import { auth } from '../lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signup: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  resendVerification: () => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function signup(email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await sendEmailVerification(credential.user)
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    await signOut(auth)
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email)
  }

  async function resendVerification() {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser)
    }
  }

  async function deleteAccount() {
    if (auth.currentUser) {
      await deleteUser(auth.currentUser)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, resetPassword, resendVerification, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}