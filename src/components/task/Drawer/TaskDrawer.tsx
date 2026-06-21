import { useTaskDetail } from '../../../hooks/useTaskDetail.ts'
import { useGetTask } from '../../../hooks/useTasks.ts'
import { showToast } from '../../../lib/toast.tsx'
import { Drawer } from 'vaul'
import { Loading } from '../../shared/Loading.tsx'
import { TaskDrawerContent } from './TaskDrawerContent.tsx'
import { useIsMobile } from '../../../hooks/useIsMobile.ts'
import type { BoardMembersWithProfile } from '../../../types/board.types.ts'
import { useEffect } from 'react'

export function TaskDrawer({
  boardId,
  members,
  isOwner,
}: {
  boardId: string
  members: BoardMembersWithProfile[]
  isOwner: boolean
}) {
  const { taskId, closeTask } = useTaskDetail()
  const { data: task, isError, isLoading } = useGetTask(taskId)
  const isMobile = useIsMobile()
  useEffect(() => {
    if (isError) showToast.error('Error getting task')
  }, [isError])
  return (
    <Drawer.Root
      open={!!taskId}
      direction={isMobile ? 'bottom' : 'right'}
      onOpenChange={(open) => !open && closeTask()}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content
          className={`bg-surface fixed p-4 outline-none ${
            isMobile
              ? 'right-0 bottom-0 left-0 h-fit rounded-t-xl'
              : 'top-0 right-0 bottom-0 w-full max-w-md'
          } `}
        >
          {isMobile && (
            <div className="bg-sunken m-auto h-1.5 w-16 rounded-full"></div>
          )}
          <Drawer.Title className="hidden">
            {task ? `${task.title} details` : 'Task details'}
          </Drawer.Title>
          <Drawer.Description className="hidden">
            Task Details
          </Drawer.Description>

          {isLoading || !task || !members ? (
            <Loading />
          ) : (
            <TaskDrawerContent
              members={members}
              isOwner={isOwner}
              task={task}
              close={closeTask}
              boardId={boardId}
              isMobile={isMobile}
            />
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
