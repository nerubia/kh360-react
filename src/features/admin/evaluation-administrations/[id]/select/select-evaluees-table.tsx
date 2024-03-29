import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { Checkbox } from "@components/ui/checkbox/checkbox"
import { Pagination } from "@components/shared/pagination/pagination"
import { setSelectedEmployeeIds } from "@redux/slices/evaluation-administration-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { formatDate } from "@utils/format-date"
import { getEvaluationResultIds } from "@redux/slices/evaluation-results-slice"

export const SelectEvalueesTable = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { selectedEmployeeIds } = useAppSelector((state) => state.evaluationAdministration)
  const { evaluation_results } = useAppSelector((state) => state.evaluationResults)
  const { users, hasPreviousPage, hasNextPage, totalPages } = useAppSelector((state) => state.users)

  useEffect(() => {
    void appDispatch(
      getEvaluationResultIds({
        evaluation_administration_id: id,
      })
    )
  }, [])

  useEffect(() => {
    const includedIds: number[] = []
    for (const evaluationResult of evaluation_results) {
      if (evaluationResult.users != null) {
        includedIds.push(evaluationResult.users.id)
      }
    }
    appDispatch(
      setSelectedEmployeeIds(
        selectedEmployeeIds.concat(
          includedIds.filter((includedId) => !selectedEmployeeIds.includes(includedId))
        )
      )
    )
  }, [evaluation_results])

  const handleSelectAll = (checked: boolean) => {
    let employeeIds = users.map((user) => user.id)
    const evaluationResultUserIds = evaluation_results.map(
      (evaluationResult) => evaluationResult.users?.id
    )
    const filteredEmployeeIds = employeeIds.filter((id) => !evaluationResultUserIds.includes(id))
    if (checked) {
      appDispatch(setSelectedEmployeeIds([...selectedEmployeeIds, ...filteredEmployeeIds]))
    } else {
      employeeIds = users.map((user) => user.id)
      appDispatch(
        setSelectedEmployeeIds(
          selectedEmployeeIds.filter((id) => !filteredEmployeeIds.includes(id))
        )
      )
    }
  }

  const handleClickCheckbox = (checked: boolean, employeeId: number) => {
    if (checked) {
      appDispatch(setSelectedEmployeeIds([...selectedEmployeeIds, employeeId]))
    } else {
      appDispatch(setSelectedEmployeeIds(selectedEmployeeIds.filter((id) => id !== employeeId)))
    }
  }

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
                          evaluation_results.find((result) => result.users?.id === user.id) !==
                          undefined
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
                          evaluation_results.find((result) => result.users?.id === user.id) !==
                          undefined
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
