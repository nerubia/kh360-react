import { type ReactNode } from "react"

interface TableProps<T extends { id: number }> {
  data: T[]
  columns: string[]
  renderCell: (item: T, column: string) => ReactNode
  onClickRow?: (id: number) => void
}

export function Table<T extends { id: number }>({
  data,
  columns,
  renderCell,
  onClickRow,
}: TableProps<T>): JSX.Element {
  const handleRowClick = (item: T) => {
    if (onClickRow != null) {
      onClickRow(item.id)
    }
  }
  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-base text-left rtl:text-right'>
        <thead className='text-xs text-black uppercase'>
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope='col' className='px-6 py-3'>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className='bg-white border-b hover:bg-slate-100 text-black'
              onClick={() => handleRowClick(item)}
            >
              {columns.map((column) => (
                <td
                  key={column}
                  className={`px-6 py-1 ${
                    index === columns.length - 1 ? "mid-w-100 md:w-90" : "w-1/6"
                  }`}
                >
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
