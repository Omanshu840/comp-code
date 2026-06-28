import { createContext, useState, useEffect, type PropsWithChildren } from 'react'
import { type Session, SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase-client'

interface AuthContextType {
  session: Session | null
  supabase: SupabaseClient
  loading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ session, supabase, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
