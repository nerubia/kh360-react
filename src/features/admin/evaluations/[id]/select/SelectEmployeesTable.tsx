import { useEffect } from "react"
import { Checkbox } from "../../../../../components/checkbox/Checkbox"
import { Pagination } from "../../../../../components/pagination/Pagination"
import { setSelectedEmployeeIds } from "../../../../../redux/slices/evaluationSlice"
import {
  getAllEmployees,
  setCheckedAll,
} from "../../../../../redux/slices/employeesSlice"
import { useAppDispatch } from "../../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../../hooks/useAppSelector"

export const SelectEmployeesTable = () => {
  const appDispatch = useAppDispatch()
  const { selectedEmployeeIds } = useAppSelector((state) => state.evaluation)
  const {
    employees,
    checkedAll,
    allEmployees,
    hasPreviousPage,
    hasNextPage,
    totalPages,
  } = useAppSelector((state) => state.employees)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const employeeIds = allEmployees.map((employee) => employee.id)
      appDispatch(setSelectedEmployeeIds(employeeIds))
      appDispatch(setCheckedAll(true))
    } else {
      appDispatch(setSelectedEmployeeIds(""))
    }
  }

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

  useEffect(() => {
    void appDispatch(getAllEmployees())
  }, [])

  return (
    <>
      <div className='flex flex-col gap-8'>
        <table className='w-full'>
          <thead className='text-left'>
            <tr>
              <th>
                <Checkbox
                  checked={checkedAll}
                  onChange={(checked) => handleSelectAll(checked)}
                />
              </th>
              <th>Name</th>
              <th>Date Started</th>
              <th>Position</th>
              <th>Employee Type</th>
            </tr>
          </thead>
          <tbody>
            {employees?.map((employee) => (
              <tr key={employee?.id}>
                <td>
                  <div className='w-fit'>
                    <Checkbox
                      checked={selectedEmployeeIds.includes(employee?.id)}
                      onChange={(checked) =>
                        handleClickCheckbox(checked, employee?.id)
                      }
                    />
                  </div>
                </td>
                <td>
                  {employee?.last_name}, {employee?.first_name}
                </td>
                <td>{employee?.user_details.start_date?.split("T")[0]}</td>
                <td>{employee?.user_details.user_position}</td>
                <td>{employee?.user_details.user_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(hasNextPage || hasPreviousPage) && (
        <div className='flex justify-center'>
          <Pagination
            hasPreviousPage={hasPreviousPage}
            hasNextPage={hasNextPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </>
  )
}
