import {
  useComments,
  useCreateComment,
  useDeleteComment,
} from '../../../hooks/useComments.ts'
import { Loading, Spinner } from '../../shared/Loading.tsx'
import { CommentItem } from './CommentItem.tsx'
import { Button } from '../../shared/Button.tsx'
import { Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../providers/AuthProvider.tsx'
import { showToast } from '../../../lib/toast.tsx'
import { useNavigate } from 'react-router'

interface TaskCommentsProps {
  taskId: string
}

export function TaskComments({ taskId }: TaskCommentsProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data, isLoading } = useComments(taskId)
  const createComment = useCreateComment()
  const deleteComment = useDeleteComment(taskId)
  const [commentValue, setCommentValue] = useState('')

  useEffect(() => {
    if (user === null) {
      showToast.error('User not authenticated')
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) return null

  const handleSubmit = () => {
    const value = commentValue.trim()
    if (!value || createComment.isPending) return
    createComment.mutate(
      { taskId, content: value, userId: user.id },
      { onSuccess: () => setCommentValue('') }
    )
  }

  const count = data?.length ?? 0

  return (
    <section className="px-1 py-4">
      <h4 className="text-text-muted text-sm font-medium tracking-wide uppercase">
        Comments{!isLoading && ` (${count})`}
      </h4>

      {isLoading ? (
        <Loading />
      ) : count === 0 ? (
        <p className="text-text-faint py-2 text-sm italic">No comments yet</p>
      ) : (
        <div className="flex flex-col gap-4 py-2">
          {data?.map((comment) => (
            <CommentItem
              key={comment.id}
              id={comment.id}
              content={comment.content}
              createdAt={comment.created_at}
              author={comment.profiles.name}
              avatarSrc={comment.profiles.avatar_url}
              deletable={comment.user_id === user.id}
              onDelete={deleteComment}
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-start gap-2">
        <div className="flex flex-1 flex-col items-end gap-2">
          <textarea
            placeholder="Add a comment..."
            rows={2}
            className="border-border bg-surface text-text focus:border-accent-border w-full resize-none rounded-md border p-2.5 text-sm outline-none"
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSubmit()
            }}
          />
          <Button
            text={createComment.isPending ? 'Sending...' : 'Comment'}
            icon={
              createComment.isPending ? (
                <Spinner size={14} />
              ) : (
                <Send size={14} />
              )
            }
            disabled={createComment.isPending || !commentValue.trim()}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </section>
  )
}
