import { type Task } from "custom-gantt-task-react"
import React, { useState } from "react"
import { Icon } from "@components/ui/icon/icon"
import { Button, LinkButton } from "@components/ui/button/button"
import { setIsEditingProjectMember } from "@redux/slices/project-member-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { setSelectedSkills, setCheckedSkills } from "@redux/slices/skills-slice"
import { deleteProjectMember } from "@redux/slices/project-members-slice"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"

export const ProjectColumn: React.FC<{
  rowHeight: number
  rowWidth: string
  fontFamily: string
  fontSize: string
  locale: string
  tasks: Task[]
  selectedTaskId: string
  setSelectedTask: (taskId: string) => void
  onExpanderClick: (task: Task) => void
}> = ({ tasks, onExpanderClick }) => {
  const appDispatch = useAppDispatch()

  const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleEdit = () => {
    appDispatch(setIsEditingProjectMember(false))
    void appDispatch(setSelectedSkills([]))
    void appDispatch(setCheckedSkills([]))
  }

  const handleDelete = () => {
    if (selectedId !== null) {
      void appDispatch(deleteProjectMember(selectedId))
      setSelectedId(null)
    }
  }

  return (
    <div className='table border-l '>
      {tasks.map((t, index) => {
        let expanderSymbol = ""
        if (t.hideChildren === false) {
          expanderSymbol = "ChevronDown"
        } else if (t.hideChildren === true) {
          expanderSymbol = "ChevronUp"
        }

        return (
          <div
            className={`table-row text-ellipsis ${index % 2 === 0 ? "" : "bg-neutral-100"}`}
            key={`${t.id}row`}
          >
            <div
              className='table-cell vertical-align whitespace-nowrap overflow-hidden h-50 md:w-300'
              title={t.name}
            >
              <div className='flex p-2'>
                <div
                  className={`flex gap-5 pl-4 items-center w-60 ${
                    t.hideChildren !== undefined ? "text-primary-500" : "pl-8"
                  } `}
                >
                  <span className='truncate'>{t.name}</span>
                  {t.hideChildren === undefined && (
                    <div className='flex items-center gap-1'>
                      <LinkButton
                        to={`${t.projectMemberId}/edit`}
                        variant='unstyled'
                        size='small'
                        onClick={handleEdit}
                      >
                        <Icon icon='PenSquare' size='extraSmall' color='gray' />
                      </LinkButton>
                      <Button
                        variant='unstyled'
                        size='small'
                        onClick={() => setSelectedId(Number(t.projectMemberId))}
                      >
                        <Icon icon='Trash' size='extraSmall' color='gray' />
                      </Button>
                    </div>
                  )}
                </div>
                <div
                  className={`${
                    expanderSymbol.length > 0 ? "text-gray-600 text-xs px-2" : "text-xs p-4"
                  } cursor-pointer`}
                  onClick={() => onExpanderClick(t)}
                >
                  {expanderSymbol.length > 0 && (
                    <>
                      {expanderSymbol === "ChevronUp" || t.hideChildren === true ? (
                        <Icon icon='ChevronUp' />
                      ) : (
                        <Icon icon='ChevronDown' />
                      )}
                    </>
                  )}
                </div>
              </div>
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
