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
    <div className="min-h-screen bg-eco-black flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-circuit-pattern opacity-5" />
      
      <div className="relative max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block mb-6 bg-eco-green/10 px-3 py-1 rounded-full">
            <code className="text-eco-green font-code text-sm">
              $ ./authenticate_user.sh
            </code>
          </div>
          <h1 className="font-code font-bold text-2xl text-eco-text mb-2">
            <span className="text-matrix-green">&gt;_</span>{" "}
            <span className="text-eco-green">GreenReguAI</span>
          </h1>
          <p className="font-code text-eco-gray">
            Access your sustainable future
          </p>
        </div>

        <div className="bg-eco-darker border border-eco-dark p-8 rounded-lg shadow-lg">
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
                    inputBorder: '#374151',
                    inputBorderHover: '#10B981',
                    inputBorderFocus: '#10B981',
                    dividerBackground: '#374151',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                  fonts: {
                    bodyFontFamily: `'Fira Code', monospace`,
                    buttonFontFamily: `'Fira Code', monospace`,
                    inputFontFamily: `'Fira Code', monospace`,
                    labelFontFamily: `'Fira Code', monospace`,
                  },
                }
              },
              className: {
                button: 'font-code hover:bg-eco-green/20 transition-all',
                input: 'font-code',
                label: 'font-code text-eco-gray',
              }
            }}
            providers={['google', 'github']}
            redirectTo={`${window.location.origin}/dashboard`}
          />
        </div>
      </div>
    </div>
  )
}