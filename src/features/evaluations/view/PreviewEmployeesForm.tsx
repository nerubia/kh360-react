import { useAppSelector } from "../../../hooks/useAppSelector"

export const PreviewEmployeesForm = () => {
  const { employees } = useAppSelector((state) => state.employees)
  const { selectedEmployeeIds } = useAppSelector((state) => state.evaluations)

  return (
    <div className='flex flex-col'>
      <h1 className='text-lg font-bold'>Review Employees</h1>
      <table className='w-full table-fixed'>
        <thead className='text-left'>
          <tr>
            <th>Name</th>
            <th>Date Started</th>
            <th>Regularized Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) =>
            selectedEmployeeIds.includes(employee.id) ? (
              <tr key={employee.id}>
                <td>
                  {employee.firstName} {employee.lastName}
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  )
}
