import { useSearchParams } from 'react-router'

export function useTaskDetail() {
  const [searchParams, setSearchParams] = useSearchParams()

  const taskId = searchParams.get('task')

  function openTask(id: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('task', id)
      return next
    })
  }

  function closeTask() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('task')
      return next
    })
  }

  return {
    taskId,
    openTask,
    closeTask,
  }
}
