import { useState, useEffect, useRef, lazy, Suspense } from "react"
import { Icon } from "@components/ui/icon/icon"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { formatDate, shortenFormatDate } from "@utils/format-date"
import { Button } from "@components/ui/button/button"
import { EvaluationAdministrationStatus } from "@custom-types/evaluation-administration-type"
import { getEvaluationTemplates } from "@redux/slices/evaluation-templates-slice"
import { getEvaluations } from "@redux/slices/evaluations-slice"
import { type EvaluationResult } from "@custom-types/evaluation-result-type"
import {
  getEvaluationResults,
  deleteEvaluationResult,
} from "@redux/slices/evaluation-results-slice"
import { useMobileView } from "@hooks/use-mobile-view"
import { setAlert } from "@redux/slices/app-slice"
import { setSelectedEmployeeIds } from "@redux/slices/evaluation-administration-slice"

export const ViewEvaluationList = () => {
  const location = useLocation()
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { evaluation_administration, selectedEmployeeIds } = useAppSelector(
    (state) => state.evaluationAdministration
  )
  const { evaluation_templates } = useAppSelector((state) => state.evaluationTemplates)
  const { evaluations } = useAppSelector((state) => state.evaluations)
  const { evaluation_results, hasNextPage } = useAppSelector((state) => state.evaluationResults)

  const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>(evaluation_results)
  const [selectedEvaluationResultId, setSelectedEvaluationResultId] = useState<string>()
  const [selectedEvaluationTemplateId, setSelectedEvaluationTemplateId] = useState<string>()
  const [dispatchedEmployees, setDispatchedEmployees] = useState<number[]>([])
  const [dispatchedEvaluationDetails, setDispatchedEvaluationDetails] = useState<string[]>([])

  const listInnerRef = useRef<HTMLDivElement>(null)
  const [currPage, setCurrPage] = useState(1)
  const [prevPage, setPrevPage] = useState(0)
  const [lastList, setLastList] = useState(false)
  const [isInsertingData, setIsInsertingData] = useState<boolean>(false)
  const isMobile = useMobileView()

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const [evaluationResultToggledState, setEvaluationResultToggledState] = useState<boolean[]>([])

  const [evaluationDetailsToggledState, setEvaluationDetailsToggledState] = useState<boolean[][]>(
    Array.from(
      {
        length: 0,
      },
      () => [false]
    )
  )

  const EvaluationAdminDialog = lazy(
    async () =>
      await import("@features/admin/evaluation-administrations/evaluation-administrations-dialog")
  )

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

  const onScroll = () => {
    if (listInnerRef.current !== null) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current
      const threshold = 1
      if (scrollTop + clientHeight + threshold >= scrollHeight) {
        setCurrPage((prevPage) => prevPage + 1)
      }
    }
  }

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

  const toggleDeleteDialog = (evaluation_result_id: string | null) => {
    setShowDeleteDialog((prev) => !prev)
    if (evaluation_result_id !== null) {
      setSelectedEvaluationResultId(evaluation_result_id)
    }
  }

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

  const handleEditEvaluationResult = async (evaluation_result_id: string | undefined) => {
    try {
      const result = await appDispatch(
        getEvaluationTemplates({
          evaluation_result_id,
        })
      )
      if (result.type === "evaluationTemplate/getEvaluationTemplates/fulfilled") {
        const templateId = result.payload[0].id
        if (evaluation_administration?.status === EvaluationAdministrationStatus.Draft) {
          navigate(
            `/admin/evaluation-administrations/${id}/evaluees/${evaluation_result_id}/evaluators/${templateId}`
          )
        } else {
          navigate(
            `/admin/evaluation-administrations/${id}/evaluees/${evaluation_result_id}/evaluators/${templateId}?callback=${location.pathname}`
          )
        }
      }
    } catch (err) {}
  }

  const handleDeleteEvaluee = async () => {
    if (selectedEvaluationResultId !== undefined) {
      try {
        const result = await appDispatch(
          deleteEvaluationResult(parseInt(selectedEvaluationResultId))
        )
        if (result.type === "evaluationResults/deleteEvaluationResult/fulfilled") {
          appDispatch(
            setAlert({
              description: `Evaluee successfully removed.`,
              variant: "success",
            })
          )
          const updatedEvaluationResults = evaluationResults.filter(
            (evaluationResult) => evaluationResult.id !== parseInt(result.payload.id)
          )
          setEvaluationResults(updatedEvaluationResults)
          setEvaluationResultToggledState((prev) => prev.slice(0, -1))
          setEvaluationDetailsToggledState((prev) => prev.slice(0, -1))
          setSelectedEvaluationResultId(undefined)
          appDispatch(
            setSelectedEmployeeIds(selectedEmployeeIds.filter((id) => id !== result.payload.id))
          )
          toggleDeleteDialog(null)
        }
      } catch (error) {}
    }
  }

  const handleAddEvaluee = () => {
    navigate(`/admin/evaluation-administrations/${id}/select`)
  }

  return (
    <>
      <div
        className='flex flex-col gap-8 overflow-y-auto md:overflow-x-hidden'
        onScroll={onScroll}
        ref={listInnerRef}
      >
        <div className='flex flex-col'>
          {evaluationResults?.map((evaluationResult, evaluationIndex) => (
            <div key={evaluationIndex} className='mb-2'>
              <div className='flex gap-2 mb-2'>
                {(evaluation_administration?.status === EvaluationAdministrationStatus.Pending ||
                  evaluation_administration?.status === EvaluationAdministrationStatus.Ongoing ||
                  evaluation_administration?.status === EvaluationAdministrationStatus.Draft) && (
                  <Button
                    testId='EditButton'
                    onClick={async () =>
                      await handleEditEvaluationResult(evaluationResult.id?.toString())
                    }
                    variant={"unstyled"}
                  >
                    <Icon icon='PenSquare' />
                  </Button>
                )}
                {evaluation_administration?.status === EvaluationAdministrationStatus.Draft && (
                  <Button
                    testId='EditButton'
                    onClick={() => toggleDeleteDialog(evaluationResult.id?.toString())}
                    variant={"unstyled"}
                  >
                    <Icon icon='Trash' />
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
                        <div
                          key={templateIndex}
                          className={`mb-2 ${
                            evaluation_administration?.status ===
                            EvaluationAdministrationStatus.Draft
                              ? "ml-14"
                              : "ml-4"
                          }`}
                        >
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
                                    <th className='md:w-170'>Evaluator</th>
                                    <th className='md:w-150'>Project</th>
                                    <th className='whitespace-nowrap md:w-150'>Evaluee Role</th>
                                    <th className='md:w-150'>%</th>
                                    <th className='md:w-150'>Duration</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {template.evaluation_details?.map(
                                    (evaluationDetails, evaluationDetailsIndex) => (
                                      <tr
                                        key={evaluationDetailsIndex}
                                        className='sm:overflow-x-auto'
                                      >
                                        <td className='min-w-196'>
                                          {evaluationDetails.evaluator?.last_name},{" "}
                                          {evaluationDetails.evaluator?.first_name}
                                        </td>
                                        <td className='min-w-100'>
                                          {evaluationDetails.project?.name}
                                        </td>
                                        <td className='min-w-150'>
                                          {evaluationDetails.project_role?.name}
                                        </td>
                                        <td className='min-w-68'>
                                          {evaluationDetails.percent_involvement}%
                                        </td>
                                        <td className='min-w-254'>
                                          {isMobile
                                            ? shortenFormatDate(evaluationDetails.eval_start_date)
                                            : formatDate(evaluationDetails.eval_start_date)}{" "}
                                          to{" "}
                                          {isMobile
                                            ? shortenFormatDate(evaluationDetails.eval_end_date)
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
      {evaluationResults.length === 0 ? (
        <div className='pb-4 pl-2'>
          No evaluees added yet. Click{" "}
          <span onClick={handleAddEvaluee} className='text-primary-500 cursor-pointer underline'>
            {" "}
            here
          </span>{" "}
          to add
        </div>
      ) : (
        <div className='flex justify-start pb-10'>
          <Button onClick={handleAddEvaluee} variant={"ghost"}>
            <Icon icon='Plus' size='small' color='primary' />
            <p className='text-primary-500 uppercase whitespace-nowrap text-sm'>Add Evaluee</p>
          </Button>
        </div>
      )}
      <Suspense>
        <EvaluationAdminDialog
          open={showDeleteDialog}
          title='Delete Evaluee'
          description={
            <>
              Are you sure you want to delete this record? <br /> This action cannot be reverted.
            </>
          }
          onClose={() => toggleDeleteDialog(null)}
          onSubmit={handleDeleteEvaluee}
        />
      </Suspense>
    </>
  )
}
