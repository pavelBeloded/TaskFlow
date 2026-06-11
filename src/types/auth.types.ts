import type { loginSchema } from '../schemas/auth.schemas.ts'
import { z } from 'zod'

export type LoginForm = z.infer<typeof loginSchema>
