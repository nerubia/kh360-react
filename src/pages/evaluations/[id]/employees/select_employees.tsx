import { useParams } from "react-router-dom"
import { Button, LinkButton } from "../../../../components/button/Button"
import { Icon } from "../../../../components/icon/Icon"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { useEffect } from "react"
import { getEvaluation } from "../../../../redux/slices/evaluationsSlice"
import { getEmployees } from "../../../../redux/slices/employeesSlice"
import { Input } from "../../../../components/input/Input"
import { Select } from "../../../../components/select/Select"

export default function SelectEmployees() {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, evaluation } = useAppSelector((state) => state.evaluations)
  const { employees } = useAppSelector((state) => state.employees)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluation(id))
      void appDispatch(getEmployees())
    }
  }, [id])

  return (
    <div className='flex flex-col gap-4'>
      <LinkButton variant='unstyled' to={`/evaluations/${id}`}>
        <Icon icon='ChevronLeft' />
        Go back
      </LinkButton>
      {loading && <div>Loading...</div>}
      {!loading && evaluation == null && <div>Not found</div>}
      {!loading && evaluation !== null && (
        <div className='flex flex-col'>
          <h1 className='text-lg font-bold'>{evaluation.name}</h1>
          <div className='flex justify-between'>
            <div className='flex gap-2'>
              <Input
                label='Name/Email'
                name='search'
                placeholder='Search name or email'
                onChange={() => {}}
              />
              <Select
                label='Status'
                name='status'
                onChange={() => {}}
                options={[
                  {
                    label: "Active",
                    value: "active",
                  },
                  {
                    label: "Other",
                    value: "other",
                  },
                ]}
              />
            </div>
            <Button onClick={() => {}}>Search</Button>
          </div>
          <table className='w-full table-fixed'>
            <thead className='text-left'>
              <tr>
                <th>Add</th>
                <th>Name</th>
                <th>Date Started</th>
                <th>Regularized Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <Button variant='ghost' size='small' onClick={() => {}}>
                      <Icon icon='Plus' />
                    </Button>
                  </td>
                  <td>
                    {employee.firstName} {employee.lastName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
