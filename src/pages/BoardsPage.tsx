import { Button } from '../components/shared/Button.tsx'
import { supabase } from '../lib/supabase.ts'

export function BoardsPage() {
  return (
    <Button
      onClick={() => {
        supabase.auth.signOut()
      }}
      text="Logout"
    />
  )
}
