import { type Task } from "custom-gantt-task-react"
import React from "react"
import { Icon } from "@components/ui/icon/icon"
import { LinkButton } from "@components/ui/button/button"

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
                    <div>
                      <LinkButton to={`${t.projectMemberId}/edit`} variant='unstyled' size='small'>
                        <Icon icon='PenSquare' size='extraSmall' color='gray' />
                      </LinkButton>
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
    </div>
  )
}
