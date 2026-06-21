import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../schemas/auth.schemas.ts'
import type { RegisterForm } from '../types/auth.types.ts'
import { supabase } from '../lib/supabase.ts'
import { Logo } from '../components/shared/Logo.tsx'
import { Button } from '../components/shared/Button.tsx'
import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import { Input } from '../components/shared/Input.tsx'
import { showToast } from '../lib/toast.tsx'

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  async function onSubmit(data: RegisterForm) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name } },
    })
    if (error) {
      showToast.error('An error occurred while signing up')
      setServerError(error.message)
      console.error(error.message)
      return
    }
    showToast.success('Signed up successfully.')
    navigate('/')
  }

  return (
    <div className="bg-surface flex w-full max-w-100 flex-col items-center justify-center gap-8 rounded-lg p-8">
      <Logo />
      <div className="flex flex-col items-center justify-center gap-1">
        <h1 className="text-text-h text-2xl">Sign up</h1>
        <p className="text-text-muted text-sm">
          Start managing your work today
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col justify-center gap-3"
      >
        <Input
          id={'name'}
          type={'text'}
          autoComplete={'name'}
          label={'Name'}
          error={errors.name}
          {...register('name')}
        />
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
          autoComplete={'new-password'}
          label={'Password'}
          error={errors.password}
          {...register('password')}
        />
        <Input
          id={'confirmPassword'}
          type={'password'}
          autoComplete={'new-password'}
          label={'Confirm Password'}
          error={errors.confirmPassword}
          {...register('confirmPassword')}
        />

        <Button text="Create account" disabled={isSubmitting} />
        {serverError && (
          <p className="text-toast-error mt-1 text-sm">{serverError}</p>
        )}
      </form>
      <p className="text-text-muted text-sm">
        Already have an account?{' '}
        <Link className="text-accent font-medium" to={'/login'}>
          Sign in
        </Link>
      </p>
    </div>
  )
}
