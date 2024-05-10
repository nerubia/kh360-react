import React from "react"
import { Checkbox } from "@components/ui/checkbox/checkbox"
import { Pagination } from "@components/shared/pagination/pagination"
import { formatDate } from "@utils/format-date"
import { type User } from "@custom-types/user-type"
import { type EvaluationResult } from "@custom-types/evaluation-result-type"
import { type SurveyResult } from "@custom-types/survey-result-type"
import { type SkillMapResult } from "@custom-types/skill-map-result-type"

interface SelectUsersTableProps {
  users: User[]
  selectedEmployeeIds: number[]
  selectResults: Array<EvaluationResult | SurveyResult | SkillMapResult> // Union type
  handleSelectAll: (checked: boolean) => void
  handleClickCheckbox: (checked: boolean, employeeId: number) => void
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
}

const SelectUsersTable: React.FC<SelectUsersTableProps> = ({
  users,
  selectedEmployeeIds,
  selectResults,
  handleSelectAll,
  handleClickCheckbox,
  hasPreviousPage,
  hasNextPage,
  totalPages,
}) => {
  return (
    <>
      <div className='flex-1 flex flex-col gap-8 overflow-y-scroll'>
        <div className='flex flex-col gap-8'>
          <table className='w-full md:table-fixed'>
            <thead className='text-left'>
              <tr>
                <th className='flex'>
                  <div className='p-1 flex items-center justify-center gap-1'>
                    <Checkbox
                      checked={users.every((user) => selectedEmployeeIds.includes(user.id))}
                      onChange={(checked) => handleSelectAll(checked)}
                      disabled={users.every(
                        (user) =>
                          selectResults.find((result) => result.users?.id === user.id) !== undefined
                      )}
                    />
                    Name
                  </div>
                </th>
                <th>Date Started</th>
                <th>Position</th>
                <th>Employee Type</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className='p-1 flex items-center justify-start gap-1'>
                      <Checkbox
                        checked={selectedEmployeeIds.includes(user.id)}
                        onChange={(checked) => handleClickCheckbox(checked, user.id)}
                        disabled={
                          selectResults.find((result) => result.users?.id === user.id) !== undefined
                        }
                      />
                      {user.last_name}, {user.first_name}
                    </div>
                  </td>
                  <td>
                    {user.user_details?.start_date !== null
                      ? formatDate(user.user_details?.start_date)
                      : ""}
                  </td>
                  <td>{user.user_details?.user_position}</td>
                  <td className='capitalize'>{user.user_details?.user_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='flex justify-center'>
        <Pagination
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          totalPages={totalPages}
        />
      </div>
    </>
  )
}

export default SelectUsersTable
