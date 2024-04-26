import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { setSelectedEmployeeIds } from "@redux/slices/survey-administration-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { getSurveyResults } from "@redux/slices/survey-results-slice"
import SelectUsersTable from "@components/shared/select-users/select-users-table"

export const SelectRespondentsTable = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { selectedEmployeeIds } = useAppSelector((state) => state.surveyAdministration)
  const { survey_results } = useAppSelector((state) => state.surveyResults)
  const { users, hasPreviousPage, hasNextPage, totalPages } = useAppSelector((state) => state.users)

  useEffect(() => {
    void appDispatch(
      getSurveyResults({
        survey_administration_id: id,
      })
    )
  }, [])

  useEffect(() => {
    const includedIds: number[] = []
    for (const surveyResult of survey_results) {
      if (surveyResult.users != null) {
        includedIds.push(surveyResult.users.id)
      }
    }
    appDispatch(
      setSelectedEmployeeIds(
        selectedEmployeeIds.concat(
          includedIds.filter((includedId) => !selectedEmployeeIds.includes(includedId))
        )
      )
    )
  }, [survey_results])

  const handleSelectAll = (checked: boolean) => {
    let employeeIds = users.map((user) => user.id)
    const evaluationResultUserIds = survey_results.map((surveyResult) => surveyResult.users?.id)
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
        selectResults={survey_results}
        handleSelectAll={handleSelectAll}
        handleClickCheckbox={handleClickCheckbox}
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        totalPages={totalPages}
      />
    </>
  )
}
