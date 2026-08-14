import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (login(password)) {
      setError('')
      navigate('/controlpanel')
    } else {
      setError('סיסמה שגויה. הרוחות לא נותנות מעבר.')
      setAttempt((n) => n + 1)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <span className="animate-float absolute top-[12%] left-[10%] text-5xl opacity-70 select-none max-[640px]:hidden">
        👻
      </span>
      <span className="animate-float absolute right-[12%] bottom-[15%] text-5xl opacity-70 select-none max-[640px]:hidden [animation-delay:1.5s]">
        🦇
      </span>
      <span className="animate-float absolute top-[20%] right-[18%] text-4xl opacity-60 select-none max-[640px]:hidden [animation-delay:0.8s]">
        🎃
      </span>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-heading text-3xl text-primary">מגדל בקרה 👻</CardTitle>
          <CardDescription>הזן סיסמה כדי להיכנס למערכת השליטה והבקרה על שמי המדינה</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                type="password"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="הזן סיסמה"
                autoFocus
              />
            </div>
            {error && (
              <Alert key={attempt} variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              כניסה 🔮
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
