import { useState, useEffect, useRef } from "react"
import { Icon } from "../../../../components/ui/icon/icon"
import { useParams, useNavigate } from "react-router-dom"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { formatDate, shortenFormatDate } from "../../../../utils/format-date"
import { Button } from "../../../../components/ui/button/button"
import { EvaluationAdministrationStatus } from "../../../../types/evaluation-administration-type"
import { getEvaluationTemplates } from "../../../../redux/slices/evaluation-templates-slice"
import { getEvaluations } from "../../../../redux/slices/evaluations-slice"
import { type EvaluationResult } from "../../../../types/evaluation-result-type"
import { getEvaluationResults } from "../../../../redux/slices/evaluation-results-slice"
import { useMobileView } from "../../../../hooks/use-mobile-view"
export const ViewEvaluationList = () => {
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { evaluation_administration } = useAppSelector((state) => state.evaluationAdministration)
  const { evaluation_templates } = useAppSelector((state) => state.evaluationTemplates)
  const { evaluations } = useAppSelector((state) => state.evaluations)
  const { evaluation_results, hasNextPage } = useAppSelector((state) => state.evaluationResults)

  const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>(evaluation_results)
  const [selectedEvaluationResultId, setSelectedEvaluationResultId] = useState<string>()
  const [selectedEvaluationTemplateId, setSelectedEvaluationTemplateId] = useState<string>()
  const [dispatchedEmployees, setDispatchedEmployees] = useState<number[]>([])
  const [dispatchedEvaluationDetails, setDispatchedEvaluationDetails] = useState<string[]>([])
  const [editEvaluationResult, setEditEvaluationResult] = useState<boolean>(false)

  const listInnerRef = useRef<HTMLDivElement>(null)
  const [currPage, setCurrPage] = useState(1)
  const [prevPage, setPrevPage] = useState(0)
  const [lastList, setLastList] = useState(false)
  const [isInsertingData, setIsInsertingData] = useState<boolean>(false)
  const isMobile = useMobileView()

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(
        getEvaluationResults({
          evaluation_administration_id: id,
        })
      )
    }
  }, [id])

  useEffect(() => {
    const fetchData = () => {
      void appDispatch(
        getEvaluationResults({
          evaluation_administration_id: id,
          page: currPage.toString(),
        })
      )
      setIsInsertingData((prevIsInsertingData) => !prevIsInsertingData)
    }

    if (!lastList && prevPage !== currPage && hasNextPage) {
      fetchData()
    }
  }, [currPage, lastList, prevPage, evaluationResults])

  useEffect(() => {
    if (evaluation_results.length <= 0) {
      setLastList(true)
      return
    } else {
      setLastList(false)
    }
    setPrevPage(currPage)
    const mergedArray = [...evaluationResults, ...evaluation_results]
    const uniqueResults = mergedArray.filter(
      (value, index, self) => index === self.findIndex((element) => element.id === value.id)
    )
    setEvaluationResults(uniqueResults)
    setEvaluationResultToggledState((prevState) => [
      ...prevState,
      ...new Array(uniqueResults.length - prevState.length).fill(false),
    ])

    setEvaluationDetailsToggledState((prevState) => [
      ...prevState,
      ...new Array(uniqueResults.length - prevState.length).fill(
        new Array(prevState.length > 0 ? prevState[0].length : 0).fill(false)
      ),
    ])
  }, [isInsertingData, evaluation_results])

  const onScroll = () => {
    if (listInnerRef.current !== null) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current
      const threshold = 1
      if (scrollTop + clientHeight + threshold >= scrollHeight) {
        setCurrPage((prevPage) => prevPage + 1)
      }
    }
  }

  const [evaluationResultToggledState, setEvaluationResultToggledState] = useState<boolean[]>([])

  const [evaluationDetailsToggledState, setEvaluationDetailsToggledState] = useState<boolean[][]>(
    Array.from(
      {
        length: 0,
      },
      () => [false]
    )
  )

  const toggleEvaluationResult = (index: number, evaluation_result_id: string | undefined) => {
    const updatedToggledState: boolean[] = [...evaluationResultToggledState]
    updatedToggledState[index] = !updatedToggledState[index]
    setEvaluationResultToggledState(updatedToggledState)
    if (!dispatchedEmployees.includes(index)) {
      void appDispatch(
        getEvaluationTemplates({
          evaluation_result_id,
          for_evaluation: true,
        })
      )
      setDispatchedEmployees((prevDispatchedEmployees) => [...prevDispatchedEmployees, index])
      setSelectedEvaluationResultId(evaluation_result_id)
    }
  }

  useEffect(() => {
    if (selectedEvaluationResultId !== undefined) {
      setEvaluationResults((prevResults) =>
        prevResults.map((result) => {
          if (result.id === parseInt(selectedEvaluationResultId)) {
            return { ...result, evaluation_templates }
          }
          return result
        })
      )
    }
  }, [evaluation_templates])

  const toggleEvaluationDetails = (
    employeeIndex: number,
    templateIndex: number,
    evaluation_result_id: string | undefined,
    evaluation_template_id: string | undefined
  ) => {
    const updatedToggledState: boolean[][] = evaluationDetailsToggledState.map((row) => [...row])
    updatedToggledState[employeeIndex][templateIndex] =
      !updatedToggledState[employeeIndex][templateIndex]

    setEvaluationDetailsToggledState(updatedToggledState)

    const evaluationDetailsKey = `${employeeIndex}_${templateIndex}`

    if (!dispatchedEvaluationDetails.includes(evaluationDetailsKey)) {
      void appDispatch(
        getEvaluations({
          evaluation_result_id,
          evaluation_template_id,
          for_evaluation: true,
        })
      )
      setDispatchedEvaluationDetails((prevDispatchedDetails) => [
        ...prevDispatchedDetails,
        evaluationDetailsKey,
      ])
      setSelectedEvaluationResultId(evaluation_result_id)
      setSelectedEvaluationTemplateId(evaluation_template_id)
    }
  }

  useEffect(() => {
    if (
      selectedEvaluationTemplateId !== undefined &&
      selectedEvaluationResultId !== undefined &&
      evaluations.length > 0
    ) {
      setEvaluationResults((prevResults) =>
        prevResults.map((result) => {
          if (result.id === parseInt(selectedEvaluationResultId)) {
            const updatedTemplates = result.evaluation_templates?.map((template) => {
              if (template.id === parseInt(selectedEvaluationTemplateId)) {
                return { ...template, evaluation_details: evaluations }
              }
              return template
            })

            return { ...result, evaluation_templates: updatedTemplates }
          }
          return result
        })
      )
    }
  }, [evaluations])

  const handleEditEvaluationResult = (evaluation_result_id: string | undefined) => {
    void appDispatch(
      getEvaluationTemplates({
        evaluation_result_id,
        for_evaluation: true,
      })
    )
    setSelectedEvaluationResultId(evaluation_result_id)
    setEditEvaluationResult(true)
  }

  useEffect(() => {
    if (editEvaluationResult && evaluation_templates[0] !== undefined) {
      navigate(
        `/admin/evaluation-administrations/${id}/evaluees/${selectedEvaluationResultId}/evaluators/${evaluation_templates[0]?.id}`
      )
    }
  }, [editEvaluationResult, evaluation_templates])

  return (
    <>
      <div
        className='flex-1 flex flex-col gap-8 overflow-y-auto md:overflow-x-hidden h-screen'
        onScroll={onScroll}
        ref={listInnerRef}
      >
        <div className='flex flex-col'>
          {evaluationResults?.map((evaluationResult, evaluationIndex) => (
            <div key={evaluationIndex} className='mb-2'>
              <div className='flex gap-2 mb-2'>
                {(evaluation_administration?.status === EvaluationAdministrationStatus.Pending ||
                  evaluation_administration?.status === EvaluationAdministrationStatus.Ongoing) && (
                  <Button
                    testId='EditButton'
                    onClick={() => handleEditEvaluationResult(evaluationResult.id?.toString())}
                    variant={"unstyled"}
                  >
                    <Icon icon='PenSquare' />
                  </Button>
                )}
                <Button
                  onClick={() =>
                    toggleEvaluationResult(evaluationIndex, evaluationResult.id?.toString())
                  }
                  variant={"unstyled"}
                >
                  <div className='flex items-center'>
                    <span className='text-xs'>
                      {evaluationResultToggledState[evaluationIndex] ? (
                        <Icon icon='ChevronDown' />
                      ) : (
                        <Icon icon='ChevronRight' />
                      )}
                    </span>
                    <span className='mr-1'>
                      {evaluationResult.users?.last_name}, {evaluationResult.users?.first_name}
                    </span>
                  </div>
                </Button>
              </div>
              {evaluationResultToggledState[evaluationIndex] && (
                <div>
                  {evaluationResult.evaluation_templates !== undefined &&
                  evaluationResult.evaluation_templates !== null &&
                  evaluationResult.evaluation_templates.length > 0
                    ? evaluationResult.evaluation_templates.map((template, templateIndex) => (
                        <div key={templateIndex} className='mb-2 ml-4'>
                          <button
                            onClick={() =>
                              toggleEvaluationDetails(
                                evaluationIndex,
                                templateIndex,
                                evaluationResult?.id?.toString(),
                                template.id?.toString()
                              )
                            }
                            className='text-sm'
                          >
                            <div className='flex items-center ml-5'>
                              <span className='text-xs'>
                                {evaluationDetailsToggledState[evaluationIndex][templateIndex] ? (
                                  <Icon icon='ChevronDown' />
                                ) : (
                                  <Icon icon='ChevronRight' />
                                )}
                              </span>
                              <span>{template.display_name}</span>
                            </div>
                          </button>
                          {evaluationDetailsToggledState[evaluationIndex][templateIndex] &&
                            template.evaluation_details !== undefined &&
                            template.evaluation_details !== null && (
                              <table className='md:w-10/12 ml-11 md:table-fixed'>
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
                                  {template.evaluation_details?.map(
                                    (evaluationDetails, evaluationDetailsIndex) => (
                                      <tr
                                        key={evaluationDetailsIndex}
                                        className='sm:overflow-x-auto'
                                      >
                                        <td className='min-w-[196px]'>
                                          {evaluationDetails.evaluator?.last_name},{" "}
                                          {evaluationDetails.evaluator?.first_name}
                                        </td>
                                        <td className='min-w-[100px]'>
                                          {evaluationDetails.project?.name}
                                        </td>
                                        <td className='min-w-[150px]'>
                                          {evaluationDetails.project_role?.name}
                                        </td>
                                        <td className='min-w-[68px]'>
                                          {evaluationDetails.percent_involvement}%
                                        </td>
                                        <td className='min-w-[254px]'>
                                          {isMobile
                                            ? typeof evaluationDetails.eval_start_date === "string"
                                              ? shortenFormatDate(evaluationDetails.eval_start_date)
                                              : "Invalid Date"
                                            : formatDate(evaluationDetails.eval_start_date)}{" "}
                                          to{" "}
                                          {isMobile
                                            ? typeof evaluationDetails.eval_end_date === "string"
                                              ? shortenFormatDate(evaluationDetails.eval_end_date)
                                              : "Invalid Date"
                                            : formatDate(evaluationDetails.eval_end_date)}
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            )}
                        </div>
                      ))
                    : null}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
