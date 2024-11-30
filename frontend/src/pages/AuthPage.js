import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'

export default function AuthPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-eco-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-eco-darker border border-eco-dark p-8 rounded-lg">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#10B981',
                    brandAccent: '#059669',
                    inputBackground: '#1F2937',
                    inputText: '#F9FAFB',
                  },
                },
              },
            }}
            providers={[]}
            redirectTo={`${window.location.origin}/dashboard`}
          />
        </div>
      </div>
    </div>
  )
}