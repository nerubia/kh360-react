import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { setSelectedEmployeeIds } from "@redux/slices/evaluation-administration-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { getEvaluationResultIds } from "@redux/slices/evaluation-results-slice"
import SelectUsersTable from "@components/shared/select-users/select-users-table"

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
      <SelectUsersTable
        users={users}
        selectedEmployeeIds={selectedEmployeeIds}
        selectResults={evaluation_results}
        handleSelectAll={handleSelectAll}
        handleClickCheckbox={handleClickCheckbox}
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        totalPages={totalPages}
      />
    </>
  )
}
