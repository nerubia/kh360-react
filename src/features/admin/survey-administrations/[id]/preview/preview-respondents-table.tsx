import { useEffect, useState } from "react"
import { type User } from "@custom-types/user-type"
import { getAllUsers } from "@redux/slices/users-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Icon } from "@components/ui/icon/icon"
import { formatDate } from "@utils/format-date"
import { Divider } from "@components/ui/divider/divider"

export const PreviewRespondentsTable = () => {
  const appDispatch = useAppDispatch()
  const { selectedEmployeeIds } = useAppSelector((state) => state.surveyAdministration)
  const { allUsers } = useAppSelector((state) => state.users)
  const [showIncluded, setShowIncluded] = useState(true)
  const [showExcluded, setShowExcluded] = useState(false)

  useEffect(() => {
    void appDispatch(getAllUsers())
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
                <th>Position</th>
                <th>Employee Type</th>
              </tr>
              <tr>
                <td>
                  <button onClick={() => setShowIncluded(!showIncluded)} className='text-sm p-1'>
                    <div className='flex items-center'>
                      <span className='mr-1'>{selectedEmployeeIds.length} </span>
                      <span className='mr-1'>Included</span>
                      <span className='text-xs'>
                        {showIncluded ? <Icon icon='ChevronDown' /> : <Icon icon='ChevronUp' />}
                      </span>
                    </div>
                  </button>
                </td>
              </tr>
            </thead>
            {showIncluded && (
              <tbody>
                {allUsers.map((user: User) =>
                  selectedEmployeeIds.includes(user.id) ? (
                    <tr key={user.id}>
                      <td></td>
                      <td>
                        {user.last_name}, {user.first_name}
                      </td>
                      <td>{formatDate(user.user_details?.start_date)}</td>
                      <td>{user.user_details?.user_position}</td>
                      <td className='capitalize'>{user.user_details?.user_type}</td>
                    </tr>
                  ) : null
                )}
              </tbody>
            )}
          </table>
        </div>
        <Divider />
        <div className='flex-1 bg-white-100'>
          <button onClick={() => setShowExcluded(!showExcluded)} className='text-sm p-1'>
            <div className='flex items-center'>
              <span className='mr-1'>{allUsers.length - selectedEmployeeIds.length} </span>
              <span className='mr-1'>Excluded</span>
              <span className='text-xs'>
                {showExcluded ? <Icon icon='ChevronDown' /> : <Icon icon='ChevronUp' />}
              </span>
            </div>
          </button>
          {showExcluded && (
            <table className='w-full table-fixed'>
              <tbody>
                {allUsers.map((employee: User) =>
                  !selectedEmployeeIds.includes(employee.id) ? (
                    <tr key={employee.id}>
                      <td className='w-20'></td>
                      <td>
                        {employee.last_name}, {employee.first_name}
                      </td>
                      <td>{formatDate(employee.user_details?.start_date)}</td>
                      <td>{employee.user_details?.user_position}</td>
                      <td className='capitalize'>{employee.user_details?.user_type}</td>
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
