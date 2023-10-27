import { useState } from "react"
import { Icon } from "../../../../components/icon/Icon"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { Loading } from "../../../../types/loadingType"
import { formatDate } from "../../../../utils/formatDate"
import { Button, LinkButton } from "../../../../components/button/Button"
import { EvaluationAdministrationStatus } from "../../../../types/evaluationAdministrationType"

export const ViewEvaluationList = () => {
  const { loading, evaluation_administration } = useAppSelector(
    (state) => state.evaluationAdministration
  )

  const toggleEmployeeDetails = (index: number) => {
    const updatedToggledState: boolean[] = [...employeeDetailsToggledState]
    updatedToggledState[index] = !updatedToggledState[index]
    setEmployeeDetailsToggledState(updatedToggledState)
  }

  const toggleEvaluationDetails = (
    employeeIndex: number,
    projectIndex: number
  ) => {
    const updatedToggledState: boolean[][] = [...evaluationDetailsToggledState]
    updatedToggledState[employeeIndex][projectIndex] =
      !updatedToggledState[employeeIndex][projectIndex]
    setEvaluationDetailsToggledState(updatedToggledState)
  }

  const [employeeDetailsToggledState, setEmployeeDetailsToggledState] =
    useState<boolean[]>(
      Array(evaluation_administration?.evaluation_results?.length).fill(false)
    )

  const [evaluationDetailsToggledState, setEvaluationDetailsToggledState] =
    useState<boolean[][]>(
      Array.from(
        {
          length: evaluation_administration?.evaluation_results
            ?.length as number,
        },
        () => [false]
      )
    )

  return (
    <>
      <div className='flex-1 flex flex-col gap-8 overflow-y-scroll overflow-x-hidden'>
        {loading === Loading.Pending && <div>Loading...</div>}
        {loading === Loading.Fulfilled && evaluation_administration == null && (
          <div>Not found</div>
        )}
        {loading === Loading.Fulfilled &&
          evaluation_administration !== null && (
            <div className='flex flex-col'>
              {evaluation_administration.evaluation_results?.map(
                (evaluationResult, evaluationIndex) => (
                  <div key={evaluationIndex} className='mb-2'>
                    <div className='flex gap-2 mb-2'>
                      {(evaluation_administration.status ===
                        EvaluationAdministrationStatus.Pending ||
                        evaluation_administration.status ===
                          EvaluationAdministrationStatus.Ongoing) && (
                        <LinkButton
                          testId='EditButton'
                          to={`/admin/evaluation-administrations/${evaluation_administration.id}/evaluees/${evaluationResult.id}/evaluators/${evaluationResult.evaluation_templates[0]?.evaluation_template_id}`}
                          variant={"unstyled"}
                        >
                          <Icon icon='PenSquare' />
                        </LinkButton>
                      )}
                      <Button
                        onClick={() => toggleEmployeeDetails(evaluationIndex)}
                        variant={"unstyled"}
                      >
                        <div className='flex items-center'>
                          <span className='text-xs'>
                            {employeeDetailsToggledState[evaluationIndex] ? (
                              <Icon icon='ChevronDown' />
                            ) : (
                              <Icon icon='ChevronRight' />
                            )}
                          </span>
                          <span className='mr-1'>
                            {evaluationResult.evaluee?.last_name},{" "}
                            {evaluationResult.evaluee?.first_name}
                          </span>
                        </div>
                      </Button>
                    </div>
                    {employeeDetailsToggledState[evaluationIndex] && (
                      <div>
                        {evaluationResult.evaluation_templates !== null
                          ? evaluationResult.evaluation_templates.map(
                              (template, templateIndex) => (
                                <div key={templateIndex} className='mb-2 ml-4'>
                                  <button
                                    onClick={() =>
                                      toggleEvaluationDetails(
                                        evaluationIndex,
                                        templateIndex
                                      )
                                    }
                                    className='text-sm'
                                  >
                                    <div className='flex items-center ml-5'>
                                      <span className='text-xs'>
                                        {evaluationDetailsToggledState[
                                          evaluationIndex
                                        ][templateIndex] ? (
                                          <Icon icon='ChevronDown' />
                                        ) : (
                                          <Icon icon='ChevronRight' />
                                        )}
                                      </span>
                                      <span>
                                        {template.evaluation_template_name} [{" "}
                                        {
                                          template.evaluation_details[0]
                                            .evaluator_role?.short_name
                                        }{" "}
                                        ]
                                      </span>
                                    </div>
                                  </button>
                                  {evaluationDetailsToggledState[
                                    evaluationIndex
                                  ][templateIndex] && (
                                    <table className='w-10/12 ml-11 table-fixed'>
                                      <thead className='sticky top-0 bg-white text-left'>
                                        <tr>
                                          <th>Evaluator</th>
                                          <th>Project</th>
                                          <th>Evaluee Role</th>
                                          <th>%</th>
                                          <th>Duration</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {template.evaluation_details !== null
                                          ? template.evaluation_details.map(
                                              (
                                                evaluationDetails,
                                                evaluationDetailsIndex
                                              ) => (
                                                <tr
                                                  key={evaluationDetailsIndex}
                                                >
                                                  <td>
                                                    {
                                                      evaluationDetails
                                                        .evaluator?.last_name
                                                    }
                                                    ,{" "}
                                                    {
                                                      evaluationDetails
                                                        .evaluator?.first_name
                                                    }
                                                  </td>
                                                  <td>
                                                    {
                                                      evaluationDetails.project
                                                        ?.name
                                                    }
                                                  </td>
                                                  <td>
                                                    {
                                                      evaluationDetails
                                                        .evaluee_role
                                                        ?.short_name
                                                    }
                                                  </td>
                                                  <td>
                                                    {
                                                      evaluationDetails.percent_involvement
                                                    }
                                                    %
                                                  </td>
                                                  <td>
                                                    {formatDate(
                                                      evaluationDetails.eval_start_date
                                                    )}{" "}
                                                    to{" "}
                                                    {formatDate(
                                                      evaluationDetails.eval_end_date
                                                    )}
                                                  </td>
                                                </tr>
                                              )
                                            )
                                          : null}
                                      </tbody>
                                    </table>
                                  )}
                                </div>
                              )
                            )
                          : null}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
      </div>
    </>
  )
}
