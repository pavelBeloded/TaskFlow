import { Link, useNavigate, useParams } from 'react-router'
import { useBoard } from '../hooks/useBoards.ts'
import { showToast } from '../lib/toast.tsx'
import { Loading } from '../components/shared/Loading.tsx'
import { ArrowLeft, Plus } from 'lucide-react'
import { Column } from '../components/board/Column.tsx'
import { Button } from '../components/shared/Button.tsx'
import { useState } from 'react'
import { useCreateColumn } from '../hooks/useColumns.ts'
import { InputModal } from '../components/shared/InputModal.tsx'

export function BoardPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const createColumn = useCreateColumn()

  const { data, isLoading, isError } = useBoard(id!)

  function handleClick() {
    if (!id || !data) {
      showToast.error('Error creating column')
      return
    }
    createColumn.mutate(
      {
        title: inputValue,
        boardId: id,
        position: data.columns.length,
      },
      {
        onSuccess: () => {
          setIsOpen(false)
        },
      }
    )
  }

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    showToast.error('Error occurred during board loading')
    return navigate('/')
  }

  if (!data) {
    showToast.info('No data found')
    return (
      <div className="p-4 md:p-6">
        <Link to={'/'} className={'text-text flex items-center gap-1 text-lg'}>
          <ArrowLeft size={16} />
          Back
        </Link>
        <h1 className="text-text-h text-center text-3xl">Board not found</h1>
      </div>
    )
  }

  return (
    <div className="max-w-5xl p-6">
      <header className={'mb-5 flex items-center justify-start gap-5'}>
        <Link to={'/'} className={'text-text flex items-center gap-1 text-lg'}>
          <ArrowLeft size={16} />
          Back
        </Link>
        <h1 className="text-text-h text-xl">{data.title}</h1>
      </header>
      <div className="flex w-full items-start gap-6 overflow-x-auto">
        {data.columns.map((column) => (
          <Column
            tasks={column.tasks}
            title={column.title}
            id={column.id}
            boardId={id!}
            key={column.id}
          />
        ))}
        <Button
          onClick={() => {
            setIsOpen(true)
          }}
          className="w-72 shrink-0"
          icon={<Plus size={16} />}
          variant={'outline'}
          text={'Add column'}
        />
      </div>

      <InputModal
        value={inputValue}
        setValue={setInputValue}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isPending={createColumn.isPending}
        title={'New column'}
        description={'Create new column'}
        label={'New column'}
        actionName={'Create column'}
        pendingName={'Creating...'}
        handleSubmit={handleClick}
      />
    </div>
  )
}
