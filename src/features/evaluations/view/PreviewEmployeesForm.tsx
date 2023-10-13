import { useParams } from "react-router-dom"
import { Button, LinkButton } from "../../../components/button/Button"
import { useAppSelector } from "../../../hooks/useAppSelector"

export const PreviewEmployeesForm = () => {
  const { id } = useParams()
  const { employees } = useAppSelector((state) => state.employees)
  const { selectedEmployeeIds } = useAppSelector((state) => state.evaluations)

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-lg font-bold'>Review Employees</h1>
      <div className='bg-gray-100 h-[calc(100vh_-_240px)] overflow-scroll'>
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
      <div className='flex justify-between'>
        <LinkButton variant='destructive' to={`/evaluations/${id}/select`}>
          Exit & Cancel
        </LinkButton>
        <Button onClick={() => {}}>Save & Proceed</Button>
      </div>
    </div>
  )
}
