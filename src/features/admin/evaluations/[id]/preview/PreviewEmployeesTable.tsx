import { useEffect, useState } from "react"
import { type User } from "../../../../../types/userType"
import { getAllEmployees } from "../../../../../redux/slices/employeesSlice"
import { useAppDispatch } from "../../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../../hooks/useAppSelector"
import { Icon } from "../../../../../components/icon/Icon"

export const PreviewEmployeesTable = () => {
  const appDispatch = useAppDispatch()
  const { selectedEmployeeIds } = useAppSelector((state) => state.evaluation)
  const { allEmployees } = useAppSelector((state) => state.employees)
  const [showIncluded, setShowIncluded] = useState(true)
  const [showExcluded, setShowExcluded] = useState(true)

  useEffect(() => {
    void appDispatch(getAllEmployees())
  }, [])

  return (
    <>
      <div className='flex-1 flex flex-col gap-8 overflow-y-scroll'>
        <div className='flex flex-col gap-4 bg-white-100'>
          <table className='w-full table-fixed'>
            <thead className='sticky top-0 bg-white text-left'>
              <tr>
                <th className='w-20'></th>
                <th>Name</th>
                <th>Date Started</th>
                <th>Role</th>
                <th>Employee Type</th>
              </tr>
            </thead>
            <button
              onClick={() => setShowIncluded(!showIncluded)}
              className='text-sm p-1'
            >
              <div className='flex items-center'>
                <span className='mr-1'>{selectedEmployeeIds.length} </span>
                <span className='mr-1'>Included</span>
                <span className='text-xs'>
                  {showIncluded ? (
                    <Icon icon='ChevronDown' />
                  ) : (
                    <Icon icon='ChevronUp' />
                  )}
                </span>
              </div>
            </button>
            {showIncluded && (
              <tbody>
                {allEmployees.map((employee: User) =>
                  selectedEmployeeIds.includes(employee.id) ? (
                    <tr key={employee.id}>
                      <td></td>
                      <td>
                        {employee.last_name}, {employee.first_name}
                      </td>
                      <td>
                        {employee.user_details?.start_date?.split("T")[0]}
                      </td>
                      <td>{employee.user_details?.user_position}</td>
                      <td>{employee.user_details?.user_type}</td>
                    </tr>
                  ) : null
                )}
              </tbody>
            )}
          </table>
        </div>
        <div className='border-t border-gray-300 w-full'></div>
        <div className='flex-1 bg-white-100'>
          <button
            onClick={() => setShowExcluded(!showExcluded)}
            className='text-sm p-1'
          >
            <div className='flex items-center'>
              <span className='mr-1'>
                {allEmployees.length - selectedEmployeeIds.length}{" "}
              </span>
              <span className='mr-1'>Excluded</span>
              <span className='text-xs'>
                {showExcluded ? (
                  <Icon icon='ChevronDown' />
                ) : (
                  <Icon icon='ChevronUp' />
                )}
              </span>
            </div>
          </button>
          {showExcluded && (
            <table className='w-full table-fixed'>
              <tbody>
                {allEmployees.map((employee: User) =>
                  !selectedEmployeeIds.includes(employee.id) ? (
                    <tr key={employee.id}>
                      <td className='w-20'></td>
                      <td>
                        {employee.last_name}, {employee.first_name}
                      </td>
                      <td>
                        {employee.user_details?.start_date?.split("T")[0]}
                      </td>
                      <td>{employee.user_details?.user_position}</td>
                      <td>{employee.user_details?.user_type}</td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
