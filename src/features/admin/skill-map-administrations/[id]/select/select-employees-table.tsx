import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { setSelectedEmployeeIds } from "@redux/slices/survey-administration-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { getSkillMapResults } from "@redux/slices/skill-map-results-slice"
import SelectUsersTable from "@components/shared/select-users/select-users-table"

export const SelectEmployeesTable = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { selectedEmployeeIds } = useAppSelector((state) => state.skillMapAdministration)
  const { skill_map_results } = useAppSelector((state) => state.skillMapResults)
  const { users, hasPreviousPage, hasNextPage, totalPages } = useAppSelector((state) => state.users)

  useEffect(() => {
    void appDispatch(
      getSkillMapResults({
        skill_map_administration_id: id,
      })
    )
  }, [])

  useEffect(() => {
    const includedIds: number[] = []
    for (const skillMapResult of skill_map_results) {
      if (skillMapResult.users != null) {
        includedIds.push(skillMapResult.users.id)
      }
    }
    appDispatch(
      setSelectedEmployeeIds(
        selectedEmployeeIds.concat(
          includedIds.filter((includedId) => !selectedEmployeeIds.includes(includedId))
        )
      )
    )
  }, [skill_map_results])

  const handleSelectAll = (checked: boolean) => {
    let employeeIds = users.map((user) => user.id)
    const skillMapResultUserIds = skill_map_results.map(
      (skillMapResult) => skillMapResult.users?.id
    )
    const filteredEmployeeIds = employeeIds.filter((id) => !skillMapResultUserIds.includes(id))
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
    <SelectUsersTable
      users={users}
      selectedEmployeeIds={selectedEmployeeIds}
      selectResults={skill_map_results}
      hasPreviousPage={hasPreviousPage}
      hasNextPage={hasNextPage}
      totalPages={totalPages}
      handleSelectAll={handleSelectAll}
      handleClickCheckbox={handleClickCheckbox}
    />
  )
}
