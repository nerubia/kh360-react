import { type ReactNode } from "react"

interface TableProps<T extends { id: number }> {
  data: T[]
  columns: string[]
  renderCell: (item: T, column: string) => ReactNode
  onClickRow?: (id: number) => void
  isRowClickable?: boolean
}
export function Table<T extends { id: number }>({
  data,
  columns,
  renderCell,
  onClickRow,
  isRowClickable = false,
}: TableProps<T>): JSX.Element {
  const handleRowClick = (item: T) => {
    if (onClickRow != null) {
      onClickRow(item.id)
    }
  }

  const columnWidth = 100 / columns.length

  return (
    <div className='relative overflow-x-auto sm:rounded-lg'>
      <table className='w-full text-left rtl:text-right'>
        <thead className='text-black'>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope='col'
                className={`pr-3 py-2 whitespace-nowrap text-base ${
                  ["Score", "Z-Score", "Banding", "Role", "Actions", "Status"].includes(column)
                    ? "w-1/20"
                    : `w-${columnWidth}`
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
                isRowClickable ? "hover:bg-slate-100 hover:cursor-pointer" : ""
              } text-black`}
              onClick={isRowClickable ? () => handleRowClick(item) : undefined}
            >
              {columns.map((column) => (
                <td key={column} className={`pr-3 py-2`}>
                  {renderCell(item, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
