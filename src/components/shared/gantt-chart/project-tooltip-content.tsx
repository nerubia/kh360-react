import { type Task } from "custom-gantt-task-react"
import React from "react"
import { formatDateRange } from "../../../utils/format-date"

export const ProjectTooltipContent: React.FC<{
  task: Task
  fontSize: string
  fontFamily: string
}> = ({ task }) => {
  return (
    <>
      {task.role !== undefined && (
        <div className='absolute z-50 w-max max-w-md bg-[#fff8c5] text-[#9b6700] text-xs border border-[#f1dd9f] rounded-md p-1.5 group-hover:visible bottom-full left-1/2 -translate-x-3/4 mb-1'>
          <p>
            <b>{task.name}</b>
          </p>
          <p>Role: {task.role}</p>
          <p>Project Duration: {formatDateRange(task.start, task.end)}</p>
          <p>Percentage assignment: {task.progress}%</p>
        </div>
      )}
    </>
  )
}
