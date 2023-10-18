import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getEmployees } from "../../../../redux/slices/employeesSlice"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { Input } from "../../../../components/input/Input"
import { Button, LinkButton } from "../../../../components/button/Button"
import { Checkbox } from "../../../../components/checkbox/Checkbox"
import { setSelectedEmployeeIds } from "../../../../redux/slices/evaluationSlice"
import { CustomSelect } from "../../../../components/select/CustomSelect"

export const SelectEmployeesForm = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { selectedEmployeeIds } = useAppSelector((state) => state.evaluation)
  const { employees } = useAppSelector((state) => state.employees)

  const [filters, setFilters] = useState({
    nameOrEmail: "",
    status: "active",
  })
  const [filteredEmployees, setFilteredEmployees] = useState(employees)

  useEffect(() => {
    void appDispatch(getEmployees())
  }, [])

  useEffect(() => {
    const filteredResults = employees.filter((employee) => {
      if (
        (employee.email.toLowerCase().includes(filters.nameOrEmail) ||
          employee.first_name.toLowerCase().includes(filters.nameOrEmail) ||
          employee.last_name.toLowerCase().includes(filters.nameOrEmail)) &&
        ((employee.is_active && filters.status === "active") ||
          (!employee.is_active && filters.status === "inactive"))
      ) {
        return employee
      }
      return null
    })
    setFilteredEmployees(filteredResults)
  }, [employees, filters])

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
            onChange={(e) =>
              setFilters({ ...filters, nameOrEmail: e.target.value })
            }
          />
          <CustomSelect
            label='Status'
            name='status'
            onChange={(newValue) =>
              setFilters({
                ...filters,
                status: newValue !== null ? newValue.value : "",
              })
            }
            options={[
              {
                label: "Active",
                value: "active",
              },
              {
                label: "Inactive",
                value: "inactive",
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
              <th>
                <Checkbox onChange={() => {}} />
              </th>
              <th>Name</th>
              <th>Date Started</th>
              <th>Regularized Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
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
                <td>started</td>
                <td>Regularized</td>
                <td>{employee.is_active ? "Yes" : "No"}</td>
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
