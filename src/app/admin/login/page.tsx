'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      })

      if (error) {
        throw error
      }

      toast({
        title: "Link de conectare trimis",
        description: "Verifică emailul pentru linkul de conectare",
      })
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Eroare",
        description: "Nu s-a putut trimite linkul de conectare",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            AutoOrder Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Conectează-te cu emailul tău
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Conectare Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@autoorder.ro"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Se trimite...' : 'Trimite link de conectare'}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>
                Vei primi un link de conectare pe email. 
                Doar utilizatorii cu rol admin pot accesa panoul.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
