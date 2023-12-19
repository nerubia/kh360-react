import React from "react"

export const ProjectHeader: React.FC<{
  headerHeight: number
  rowWidth: string
  fontFamily: string
  fontSize: string
}> = ({ rowWidth }) => {
  return (
    <div className='table border-b border-t border-l h-[50px] md:w-[300px] w-full'>
      <div className='table-row list-none'>
        <div className={`ml-4 table-cell align-middle min-w-[${rowWidth}]`}></div>
      </div>
    </div>
  )
}
