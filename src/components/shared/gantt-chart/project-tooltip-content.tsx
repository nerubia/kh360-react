import { type Task } from "custom-gantt-task-react"
import React from "react"
import { formatDateRange } from "@utils/format-date"

export const ProjectTooltipContent: React.FC<{
  task: Task
  fontSize: string
  fontFamily: string
}> = ({ task }) => {
  return (
    <>
      {task.role !== undefined && (
        <div className='absolute z-50 w-max max-w-xs bg-customYellow-300 text-customBrown-500 text-xs border border-customYellow-400 rounded-md p-1.5 group-hover:visible right-1 -translate-y-full'>
          <p className='truncate'>
            <b>{task.name}</b>
          </p>
          <p>{formatDateRange(task.start, task.end)}</p>
        </div>
      )}
    </>
  )
}
