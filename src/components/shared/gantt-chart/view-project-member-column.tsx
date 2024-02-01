import { type Task } from "custom-gantt-task-react"
import React from "react"
import { Icon } from "../../ui/icon/icon"
import Tooltip from "../../ui/tooltip/tooltip"

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
  return (
    <div className='table border-l md:w-450 w-full'>
      {tasks.map((t, index) => {
        return (
          <div
            className={`table-row text-ellipsis ${index % 2 === 0 ? "" : "bg-neutral-100"}`}
            key={`${t.id}row`}
          >
            <div className='table-cell vertical-align h-50 md:w-200 ' title={t.name}>
              <div className='p-2'>
                <div>{t.name}</div>
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
    </div>
  )
}
