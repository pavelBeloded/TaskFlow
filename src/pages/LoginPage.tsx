import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../schemas/auth.schemas.ts'
import type { LoginForm } from '../types/auth.types.ts'
import { supabase } from '../lib/supabase.ts'
import { Logo } from '../components/shared/Logo.tsx'
import { Button } from '../components/shared/Button.tsx'
import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import { Input } from '../components/shared/Input.tsx'

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  async function onSubmit(data: LoginForm) {
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) {
      setServerError(error.message)
      console.error(error.message)
      return
    }
    navigate('/')
  }

  return (
    <div className="bg-surface flex w-full max-w-100 flex-col items-center justify-center gap-8 rounded-lg p-8">
      <Logo />
      <div className="flex flex-col items-center justify-center gap-1">
        <h1 className="text-text-h text-2xl">Sign in</h1>
        <p className="text-text-muted text-sm">Welcome back to TaskFlow</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col justify-center gap-3"
      >
        <Input
          id={'email'}
          type={'email'}
          autoComplete={'email'}
          label={'Email'}
          error={errors.email}
          {...register('email')}
        />
        <Input
          id={'password'}
          type={'password'}
          autoComplete={'password'}
          label={'Password'}
          error={errors.password}
          {...register('password')}
        />
        <Button text="Login" disabled={isSubmitting} />
        {serverError && (
          <p className="text-toast-error mt-1 text-sm">{serverError}</p>
        )}
      </form>
      <p className="text-text-muted text-sm">
        Don't have an account?{' '}
        <Link className="text-accent font-medium" to={'/register'}>
          Sign up
        </Link>
      </p>
    </div>
  )
}
