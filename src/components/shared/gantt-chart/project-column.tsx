import { type Task } from "custom-gantt-task-react"
import React from "react"
import { Icon } from "../../ui/icon/icon"
import { LinkButton } from "../../ui/button/button"

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
  return (
    <div className='table border-l '>
      {tasks.map((t, index) => {
        let expanderSymbol = ""
        if (t.hideChildren === false) {
          expanderSymbol = "ChevronDown"
        } else if (t.hideChildren === true) {
          expanderSymbol = "ChevronRight"
        }

        return (
          <div
            className={`table-row text-ellipsis ${index % 2 === 0 ? "" : "bg-[#f5f5f5]"}`}
            key={`${t.id}row`}
          >
            <div
              className='table-cell vertical-align whitespace-nowrap overflow-hidden h-[50px] md:w-[300px]'
              title={t.name}
            >
              <div className='flex p-2'>
                <div
                  className={`${
                    expanderSymbol.length > 0 ? "text-gray-600 text-xs" : "text-xs p-4"
                  } cursor-pointer`}
                  onClick={() => onExpanderClick(t)}
                >
                  {expanderSymbol.length > 0 && (
                    <>
                      {expanderSymbol === "ChevronRight" || t.hideChildren === true ? (
                        <Icon icon='ChevronRight' />
                      ) : (
                        <Icon icon='ChevronDown' />
                      )}
                    </>
                  )}
                </div>
                <div className='flex gap-5 items-center'>
                  {t.name}
                  {t.hideChildren === undefined && (
                    <div>
                      <LinkButton to={`${t.projectMemberId}/edit`} variant='unstyled' size='small'>
                        <Icon icon='PenSquare' size='extraSmall' color='gray' />
                      </LinkButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
