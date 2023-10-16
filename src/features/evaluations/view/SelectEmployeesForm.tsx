import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { getEmployees } from "../../../redux/slices/employeesSlice"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { setSelectedEmployeeIds } from "../../../redux/slices/evaluationsSlice"
import { Input } from "../../../components/input/Input"
import { Select } from "../../../components/select/Select"
import { Button, LinkButton } from "../../../components/button/Button"
import { Checkbox } from "../../../components/checkbox/Checkbox"

export const SelectEmployeesForm = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { selectedEmployeeIds } = useAppSelector((state) => state.evaluations)
  const { employees } = useAppSelector((state) => state.employees)

  useEffect(() => {
    void appDispatch(getEmployees())
  }, [])

  const handleClickCheckbox = (checked: boolean, employeeId: number) => {
    if (checked) {
      appDispatch(setSelectedEmployeeIds([...selectedEmployeeIds, employeeId]))
    } else {
      appDispatch(
        setSelectedEmployeeIds(
          selectedEmployeeIds.filter((id) => id !== employeeId)
        )
      )
    }
  }

  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-4'>
      <h1 className='text-lg font-bold'>Select Employees</h1>
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
      <div className='flex-1 bg-gray-100 overflow-y-scroll'>
        <table className='relative w-full'>
          <thead className='sticky top-0 bg-white text-left'>
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
                  <div className='w-fit'>
                    <Checkbox
                      checked={selectedEmployeeIds.includes(employee.id)}
                      onChange={(checked) =>
                        handleClickCheckbox(checked, employee.id)
                      }
                    />
                  </div>
                </td>
                <td>
                  {employee.first_name} {employee.last_name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex justify-between'>
        <LinkButton variant='destructive' to={`/evaluations/${id}`}>
          Exit & Cancel
        </LinkButton>
        <LinkButton to={`/evaluations/${id}/preview`}>
          Check & Preview
        </LinkButton>
      </div>
    </div>
  )
}
