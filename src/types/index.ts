import type { Database } from './database.types'

export type Board = Database['public']['Tables']['boards']['Row']
export type Column = Database['public']['Tables']['columns']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type BoardMember = Database['public']['Tables']['board_members']['Row']

export type BoardInsert = Database['public']['Tables']['boards']['Insert']
export type ColumnInsert = Database['public']['Tables']['columns']['Insert']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']

export type TaskUpdate = Database['public']['Tables']['tasks']['Update']
export type ColumnUpdate = Database['public']['Tables']['columns']['Update']
export type BoardUpdate = Database['public']['Tables']['boards']['Update']
