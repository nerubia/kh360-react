import { type Task } from "custom-gantt-task-react"
import React, { useState } from "react"
import { Icon } from "@components/ui/icon/icon"
import Tooltip from "@components/ui/tooltip/tooltip"
import { Button } from "@components/ui/button/button"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { deleteProjectMember } from "@redux/slices/project-members-slice"
import { useParams } from "react-router-dom"
import { getProject } from "@redux/slices/project-slice"

export const ViewProjectMemberColumn: React.FC<{
  rowHeight: number
  rowWidth: string
  fontFamily: string
  fontSize: string
  locale: string
  tasks: Task[]
  selectedTaskId: string
  setSelectedTask: (taskId: string) => void
  onExpanderClick: (task: Task) => void
}> = ({ tasks, rowWidth }) => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()

  const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleDelete = async () => {
    if (selectedId !== null) {
      await appDispatch(deleteProjectMember(selectedId))
      setSelectedId(null)
      if (id !== undefined) {
        void appDispatch(getProject(parseInt(id)))
      }
    }
  }

  return (
    <div className='table border-l md:w-450 w-full'>
      {tasks.map((t, index) => {
        return (
          <div
            className={`table-row text-ellipsis ${index % 2 === 0 ? "" : "bg-neutral-100"}`}
            key={`${t.id}row`}
          >
            <div className='table-cell vertical-align h-50 md:w-200' title={t.name}>
              <div className='p-2 md:w-52'>
                <div className='flex items-center gap-5'>
                  {t.name}
                  {t.hideChildren === false && (
                    <Button
                      variant='unstyled'
                      size='small'
                      onClick={() => setSelectedId(Number(t.projectMemberId))}
                    >
                      <Icon icon='Trash' size='extraSmall' color='gray' />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
              className='table-cell align-middle md:w-250 overflow-visible'
            >
              {(t?.dependencies?.length ?? 0) > 0 && (
                <Tooltip placement='right'>
                  <Tooltip.Trigger>
                    <Icon icon='Info' color={"primary"}></Icon>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    {t?.dependencies?.map((projectMemberSkill, index) => (
                      <pre
                        className='flex font-sans break-words whitespace-pre-wrap text-xs md:text-xs md:w-150'
                        key={index}
                      >
                        {projectMemberSkill}
                      </pre>
                    ))}
                  </Tooltip.Content>
                </Tooltip>
              )}
            </div>
          </div>
        )
      })}
      <CustomDialog
        open={selectedId !== null}
        title='Confirm Delete'
        description='Are you sure you want to delete this item? This action cannot be undone.'
        onClose={() => setSelectedId(null)}
        onSubmit={handleDelete}
        loading={false}
      />
    </div>
  )
}
