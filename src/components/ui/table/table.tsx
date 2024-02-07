import { type ReactNode } from "react"

interface TableProps<T extends { id: number }> {
  data: T[]
  columns: ReactNode[]
  renderCell: (item: T, column: string | ReactNode, index: number) => ReactNode
  onClickRow?: (id: number) => void
  isRowClickable?: boolean
  overflowXAuto?: boolean
  overflowYHidden?: boolean
}

export function Table<T extends { id: number }>({
  data,
  columns,
  renderCell,
  onClickRow,
  isRowClickable = false,
  overflowXAuto = true,
  overflowYHidden = true,
}: TableProps<T>): JSX.Element {
  const handleRowClick = (item: T) => {
    if (onClickRow != null) {
      onClickRow(item.id)
    }
  }

  const smallColumns = ["Score", "Z-Score", "Banding", "Role", "Actions", "Default"]
  const wrapColumns = ["With Recommendation", "Evaluator Role", "Evaluee Role"]
  const columnWidth = 100 / columns.length

  const containerClassName = `relative h-full sm:rounded-lg ${
    overflowXAuto ? "overflow-x-auto" : ""
  } ${overflowYHidden ? "overflow-y-hidden" : ""}`

  return (
    <div className={containerClassName}>
      <table className='w-full text-left rtl:text-right'>
        <thead className='text-black'>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope='col'
                className={`pr-3 py-2 ${
                  smallColumns.includes(column as string)
                    ? "whitespace-nowrap w-1/20"
                    : wrapColumns.includes(column as string)
                    ? "whitespace-normal text-center"
                    : `whitespace-nowrap w-${columnWidth}`
                }`}
              >
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
              } text-black`}
              onClick={isRowClickable ? () => handleRowClick(item) : undefined}
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
