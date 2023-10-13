import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button, LinkButton } from "../../../components/button/Button"
import { Input } from "../../../components/input/Input"
import { Select } from "../../../components/select/Select"
import { getEmployees } from "../../../redux/slices/employeesSlice"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { Checkbox } from "../../../components/checkbox/Checkbox"
import { setSelectedEmployeeIds } from "../../../redux/slices/evaluationsSlice"

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
    <div className='flex flex-col'>
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
                {employee.firstName} {employee.lastName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <LinkButton to={`/evaluations/${id}/employees/preview`}>
        Check and preview
      </LinkButton>
    </div>
  )
}
