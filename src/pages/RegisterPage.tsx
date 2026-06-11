import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../schemas/auth.schemas.ts'
import type { RegisterForm } from '../types/auth.types.ts'
import { supabase } from '../lib/supabase.ts'
import { Logo } from '../components/shared/Logo.tsx'
import { Button } from '../components/shared/Button.tsx'
import { Link, useNavigate } from 'react-router'
import { X } from 'lucide-react'
import { useState } from 'react'

const InputStyles = {
  basic: 'bg-sunken text-text rounded-md px-3 py-2 text-base',
  error:
    'bg-coral-200 border-2 border-toast-error-border text-text rounded-md px-3 py-2 text-base',
}

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
        <h1 className="text-text-h text-2xl">Sign up</h1>
        <p className="text-text-muted text-sm">
          Start managing your work today
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col justify-center gap-3"
      >
        <div className="flex w-full grow flex-col items-stretch gap-1.25">
          <label htmlFor="name" className="text-text-h text-sm">
            Name
          </label>
          <input
            id="name"
            autoComplete={'name'}
            type="text"
            className={errors.name ? InputStyles.error : InputStyles.basic}
            {...register('name')}
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          <p className="text-toast-error mt-1 flex items-center gap-1 text-sm">
            {errors.name && <X size={14} />}
            {errors.name?.message}
          </p>
        </div>

        <div className="flex w-full grow flex-col items-stretch gap-1.25">
          <label htmlFor="email" className="text-text-h text-sm">
            Email
          </label>
          <input
            id="email"
            autoComplete={'email'}
            type="email"
            className={errors.email ? InputStyles.error : InputStyles.basic}
            {...register('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          <p className="text-toast-error mt-1 flex items-center gap-1 text-sm">
            {errors.email && <X size={14} />}
            {errors.email?.message}
          </p>
        </div>
        <div className="flex w-full grow flex-col gap-1.25">
          <label htmlFor="password" className="text-text-h text-sm">
            Password
          </label>
          <input
            id="password"
            autoComplete={'new-password'}
            type="password"
            className={errors.password ? InputStyles.error : InputStyles.basic}
            {...register('password')}
            aria-invalid={errors.password ? 'true' : 'false'}
          />

          <p className="text-toast-error mt-1 flex items-center gap-1 text-sm">
            {errors.password && <X size={14} />}
            {errors.password?.message}
          </p>
        </div>
        <div className="flex w-full grow flex-col gap-1.25">
          <label htmlFor="confirmPassword" className="text-text-h text-sm">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            autoComplete={'new-password'}
            type="password"
            className={
              errors.confirmPassword ? InputStyles.error : InputStyles.basic
            }
            {...register('confirmPassword')}
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
          />

          <p className="text-toast-error mt-1 flex items-center gap-1 text-sm">
            {errors.confirmPassword && <X size={14} />}
            {errors.confirmPassword?.message}
          </p>
        </div>
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
