import { Logo } from './Logo.tsx'
import { Avatar } from './Avatar.tsx'
import { useAuth } from '../../providers/AuthProvider.tsx'
import { Link, Outlet } from 'react-router'
import {
  Content,
  Item,
  Portal,
  Root,
  Separator,
  Trigger,
} from '@radix-ui/react-dropdown-menu'
import { supabase } from '../../lib/supabase.ts'
import { LogOut, Moon, Sun, User } from 'lucide-react'
import { useTheme } from '../../providers/ThemeProvider.tsx'
import { useProfile } from '../../hooks/useProfile.ts'
import { useQueryClient } from '@tanstack/react-query'

const itemClass =
  'flex items-center gap-2 rounded-md px-3 py-2 text-sm outline-none cursor-pointer data-highlighted:bg-sunken'

export function AppLayout() {
  const { user } = useAuth()
  const { data } = useProfile(user!.id)
  const { theme, toggleTheme } = useTheme()
  const queryClient = useQueryClient()
  return (
    <div>
      <header className="bg-surface border-border flex h-13 items-center justify-between border-b px-5 md:px-6">
        <Link to={'/'}>
          <Logo />
        </Link>

        <Root>
          <Trigger asChild>
            <button
              className="flex items-center gap-2 text-sm font-medium"
              aria-label="Navigation menu"
            >
              <Avatar name={data?.name ?? 'U'} src={data?.avatar_url} />
              <span className="hidden md:block">{data?.name}</span>
            </button>
          </Trigger>
          <Portal>
            <Content
              sideOffset={10}
              align="end"
              className="bg-surface border-border shadow-dropdown min-w-44 rounded-lg border p-1"
            >
              <Item className={itemClass} asChild>
                <Link to={`/profile/${user?.id}`}>
                  <User size={14} />
                  Profile
                </Link>
              </Item>
              <Item
                className={itemClass}
                onSelect={(e) => {
                  e.preventDefault()
                  toggleTheme()
                }}
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </Item>

              <Separator className="bg-border my-1 h-px" />

              <Item
                className={`${itemClass} text-priority-high`}
                onSelect={() => {
                  queryClient.clear()
                  supabase.auth.signOut()
                }}
              >
                <LogOut size={14} />
                Sign out
              </Item>
            </Content>
          </Portal>
        </Root>
      </header>

      <Outlet />
    </div>
  )
}
