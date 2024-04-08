import { type ReactNode } from "react"

interface TableProps<T extends { id: number }> {
  data: T[]
  columns: ReactNode[]
  renderCell: (item: T, column: string | ReactNode, index: number) => ReactNode
  onClickRow?: (id: number) => void
  isRowClickable?: boolean
  isRowDraggable?: boolean
  overflowXAuto?: boolean
  overflowYHidden?: boolean
  applyFixedColWidth?: boolean
  customWidth?: string
  handleSort?: () => void
  dragContent?: React.MutableRefObject<number>
  draggedOverContent?: React.MutableRefObject<number>
}

export function Table<T extends { id: number }>({
  data,
  columns,
  renderCell,
  onClickRow,
  isRowClickable = false,
  isRowDraggable = false,
  overflowXAuto = true,
  overflowYHidden = true,
  applyFixedColWidth = false,
  customWidth,
  handleSort,
  dragContent,
  draggedOverContent,
}: TableProps<T>): JSX.Element {
  const handleRowClick = (item: T) => {
    if (onClickRow != null) {
      onClickRow(item.id)
    }
  }

  const smallColumns = ["Score", "Z-Score", "Banding", "Actions", "Default"]
  const mediumColumns = ["Role", "Company"]
  const wrapColumns = ["With Recommendation", "Evaluator Role", "Evaluee Role"]
  const fixColWidth = ["Name", "Email Address"]
  const hasCustomWidth = ["Description"]
  const columnWidth = 100 / columns.length

  const getColumnClassName = (column: string | ReactNode) => {
    const isSmallColumn = smallColumns.includes(column as string)
    const isWrapColumn = wrapColumns.includes(column as string)
    const isMediumColumn = mediumColumns.includes(column as string)
    const isFixColWidth = applyFixedColWidth && fixColWidth.includes(column as string)
    const hasCustomColWidth = customWidth !== undefined && hasCustomWidth.includes(column as string)

    if (isSmallColumn) {
      return "whitespace-nowrap w-1/20 text-center"
    } else if (isMediumColumn) {
      return "whitespace-nowrap w-1/10"
    } else if (isWrapColumn) {
      return "whitespace-normal text-center"
    } else if (isFixColWidth) {
      return "w-1/4"
    } else if (hasCustomColWidth) {
      return customWidth
    } else {
      return `whitespace-nowrap w-${columnWidth}`
    }
  }

  const containerClassName = `relative h-full sm:rounded-lg ${
    overflowXAuto ? "overflow-x-auto" : ""
  } ${overflowYHidden ? "overflow-y-hidden" : ""}`

  return (
    <div className={containerClassName}>
      <table className='w-full text-left rtl:text-right'>
        <thead className='text-black'>
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope='col' className={`pr-3 py-2 ${getColumnClassName(column)}`}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={`bg-white border-b ${
                isRowClickable ? "hover:bg-slate-100 cursor-pointer" : ""
              } text-black ${isRowDraggable ? "cursor-grab" : ""}`}
              onClick={isRowClickable ? () => handleRowClick(item) : undefined}
              draggable={isRowDraggable}
              onDragStart={() => {
                if (dragContent !== undefined) {
                  dragContent.current = index
                }
              }}
              onDragEnter={() => {
                if (draggedOverContent !== undefined) {
                  draggedOverContent.current = index
                }
              }}
              onDragEnd={() => {
                if (handleSort !== undefined) {
                  handleSort()
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {columns.map((column, index) => (
                <td
                  key={index}
                  className={`pr-3 py-2 ${
                    wrapColumns.includes(column as string) ? "whitespace-normal" : ""
                  }`}
                >
                  {renderCell(item, column, index) ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
