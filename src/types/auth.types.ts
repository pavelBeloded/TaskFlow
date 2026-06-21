import { type loginSchema, registerSchema } from '../schemas/auth.schemas.ts'
import { z } from 'zod'

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
