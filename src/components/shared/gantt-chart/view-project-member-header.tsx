import React from "react"

export const ViewProjectMemberHeader: React.FC<{
  headerHeight: number
  rowWidth: string
  fontFamily: string
  fontSize: string
}> = ({ rowWidth, headerHeight }) => {
  return (
    <div className='table border-b border-t border-l h-50 md:w-450 w-full'>
      <div className='table-row list-none'>
        <div className={`ml-4 pl-4 table-cell align-middle min-w-[${rowWidth}]`}>Name</div>
        <div
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.25,
          }}
          className='border-r border-gray-300 opacity-100'
        />
        <div className={`ml-4 pl-4 table-cell align-middle min-w-[${rowWidth}]`}>Skills</div>
      </div>
    </div>
  )
}
