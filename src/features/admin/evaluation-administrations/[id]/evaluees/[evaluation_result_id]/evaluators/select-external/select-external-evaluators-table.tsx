import { useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { useAppDispatch } from "../../../../../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../../../../../hooks/useAppSelector"
import { Pagination } from "../../../../../../../../components/shared/pagination/pagination"
import { getExternalUsers } from "../../../../../../../../redux/slices/external-users-slice"
import { setSelectedExternalUserIds } from "../../../../../../../../redux/slices/evaluation-administration-slice"
import { getEvaluations } from "../../../../../../../../redux/slices/evaluations-slice"
import { Checkbox } from "../../../../../../../../components/ui/checkbox/checkbox"

export const SelectExternalEvaluatorsTable = () => {
  const [searchParams] = useSearchParams()
  const { evaluation_result_id, evaluation_template_id } = useParams()

  const appDispatch = useAppDispatch()
  const { external_users, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.externalUsers
  )
  const { evaluations } = useAppSelector((state) => state.evaluations)
  const { selectedExternalUserIds } = useAppSelector((state) => state.evaluationAdministration)

  useEffect(() => {
    const getEvaluationIds = async () => {
      void appDispatch(
        getEvaluations({
          evaluation_result_id,
          evaluation_template_id,
        })
      )
    }
    void getEvaluationIds()
  }, [])

  useEffect(() => {
    const includedIds: number[] = []
    for (const evaluation of evaluations) {
      if (evaluation.external_evaluator_id != null) {
        includedIds.push(evaluation.external_evaluator_id)
      }
    }
    appDispatch(
      setSelectedExternalUserIds(
        selectedExternalUserIds.concat(
          includedIds.filter((includedId) => !selectedExternalUserIds.includes(includedId))
        )
      )
    )
  }, [evaluations])

  useEffect(() => {
    void appDispatch(
      getExternalUsers({
        name: searchParams.get("name") ?? undefined,
        company: searchParams.get("company") ?? undefined,
        role: searchParams.get("role") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const handleSelectAll = (checked: boolean) => {
    let evaluatorIds = external_users.map((user) => user.id)
    if (checked) {
      appDispatch(setSelectedExternalUserIds([...selectedExternalUserIds, ...evaluatorIds]))
    } else {
      evaluatorIds = external_users.map((user) => user.id)
      appDispatch(
        setSelectedExternalUserIds(
          selectedExternalUserIds.filter((id) => !evaluatorIds.includes(id))
        )
      )
    }
  }

  const handleClickCheckbox = (checked: boolean, evaluatorId: number) => {
    if (checked) {
      appDispatch(setSelectedExternalUserIds([...selectedExternalUserIds, evaluatorId]))
    } else {
      appDispatch(
        setSelectedExternalUserIds(selectedExternalUserIds.filter((id) => id !== evaluatorId))
      )
    }
  }

  return (
    <>
      <div className='flex-1 flex flex-col gap-8 overflow-y-scroll'>
        <div className='flex flex-col gap-8'>
          <table className='w-full'>
            <thead className='text-left'>
              <tr>
                <th>
                  <Checkbox
                    checked={external_users.every((user) =>
                      selectedExternalUserIds.includes(user.id)
                    )}
                    onChange={(checked) => handleSelectAll(checked)}
                  />
                </th>
                <th className='pb-3'>Name</th>
                <th className='pb-3'>Email Address</th>
                <th className='pb-3'>Company</th>
                <th className='pb-3'>Role</th>
              </tr>
            </thead>
            <tbody>
              {external_users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className='w-fit'>
                      <Checkbox
                        checked={selectedExternalUserIds.includes(user.id)}
                        onChange={(checked) => handleClickCheckbox(checked, user.id)}
                      />
                    </div>
                  </td>
                  <td className='py-1'>
                    {user.last_name}, {user.first_name} {user.middle_name}
                  </td>
                  <td className='py-1'>{user.email}</td>
                  <td className='py-1'>{user.company}</td>
                  <td className='py-1'>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages !== 1 && (
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
