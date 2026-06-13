import { MoreVertical } from 'lucide-react'
import { parseMonthDay } from '../../utils/date.ts'
import { Button } from '../shared/Button.tsx'
import { useNavigate } from 'react-router'

interface BoardCardProps {
  title: string
  createdAt: string | null
  id: string
}

export function BoardCard({ title, createdAt, id }: BoardCardProps) {
  const navigate = useNavigate()
  return (
    <div className="bg-surface border-border-strong border-t-accent-border flex w-full max-w-md flex-col items-start gap-4 rounded-lg border-2 border-t-4 p-5">
      <header className="flex w-full items-center justify-between">
        <h3 className="text-text text-md">{title}</h3>
        <MoreVertical size={16} className="text-text-muted" />
      </header>
      <p className="text-text-muted text-sm">
        Created {parseMonthDay(createdAt)}
      </p>
      <Button
        onClick={() => {
          navigate(`/board/${id}`)
        }}
        text="Open board"
        variant="outline"
        className="w-full"
      />
    </div>
  )
}
