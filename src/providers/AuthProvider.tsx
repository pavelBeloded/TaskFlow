import type { Session, User } from '@supabase/supabase-js'
import { createContext, type ReactNode, use, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.ts'

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  return (
    <AuthContext value={{ user, session, isLoading }}>{children}</AuthContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}
