import React, { useEffect, useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Button, LinkButton } from "../../../../../../../components/ui/button/button"
import { Checkbox } from "../../../../../../../components/ui/checkbox/checkbox"
import { useAppDispatch } from "../../../../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../../../../hooks/useAppSelector"
import {
  getEvaluations,
  setForEvaluations,
  updateProject,
} from "../../../../../../../redux/slices/evaluations-slice"
import { formatDate } from "../../../../../../../utils/format-date"
import { setEvaluationResultStatus } from "../../../../../../../redux/slices/evaluation-result-slice"
import { EvaluationResultStatus } from "../../../../../../../types/evaluation-result-type"
import { Loading } from "../../../../../../../types/loadingType"
import { setAlert } from "../../../../../../../redux/slices/appSlice"
import { type Evaluation } from "../../../../../../../types/evaluation-type"
import { PageSubTitle } from "../../../../../../../components/shared/page-sub-title"
import { Icon } from "../../../../../../../components/ui/icon/icon"
import { setSelectedExternalUserIds } from "../../../../../../../redux/slices/evaluation-administration-slice"
import { getProjectMembers } from "../../../../../../../redux/slices/project-members-slice"
import Dropdown from "../../../../../../../components/ui/dropdown/dropdown"

export const EvaluatorsList = () => {
  const navigate = useNavigate()
  const { id, evaluation_result_id, evaluation_template_id } = useParams()
  const appDispatch = useAppDispatch()
  const location = useLocation()
  const { loading } = useAppSelector((state) => state.evaluationResult)
  const { evaluations } = useAppSelector((state) => state.evaluations)
  const { project_members } = useAppSelector((state) => state.projectMembers)
  const [sortedEvaluations, setSortedEvaluations] = useState<Evaluation[]>([])
  const [sortedExternalEvaluations, setSortedExternalEvaluations] = useState<Evaluation[]>([])

  useEffect(() => {
    if (evaluation_template_id !== "all") {
      void appDispatch(
        getEvaluations({
          evaluation_result_id,
          evaluation_template_id,
        })
      )
      void appDispatch(setSelectedExternalUserIds([]))
      void appDispatch(
        getProjectMembers({
          evaluation_administration_id: id,
          evaluation_result_id,
          evaluation_template_id,
        })
      )
    }
  }, [evaluation_template_id])

  useEffect(() => {
    const newEvaluations = [...evaluations]
    const sorted = newEvaluations.sort((a: Evaluation, b: Evaluation) => {
      const projectComparison = (a.project?.name ?? "").localeCompare(b.project?.name ?? "")
      if (projectComparison !== 0) {
        return projectComparison
      }
      const lastNameComparison = (a.evaluator?.last_name ?? "").localeCompare(
        b.evaluator?.last_name ?? ""
      )
      if (lastNameComparison !== 0) {
        return lastNameComparison
      }
      return (a.evaluator?.first_name ?? "").localeCompare(b.evaluator?.first_name ?? "")
    })
    setSortedEvaluations(
      sorted.filter((evaluation) => evaluation.is_external === undefined || !evaluation.is_external)
    )
    setSortedExternalEvaluations(sorted.filter((evaluation) => evaluation.is_external === true))
  }, [evaluations])

  const handleSelectAll = (checked: boolean, external: boolean) => {
    void appDispatch(
      setForEvaluations({
        evaluation_ids: external
          ? sortedExternalEvaluations.map((evaluation) => evaluation.id)
          : sortedEvaluations.map((evaluation) => evaluation.id),
        for_evaluation: checked,
      })
    )
  }

  const handleClickCheckbox = (evaluationId: number, checked: boolean) => {
    if (evaluationId !== undefined) {
      void appDispatch(
        setForEvaluations({
          evaluation_ids: [evaluationId],
          for_evaluation: checked,
        })
      )
    }
  }

  const handleUpdateStatus = async (status: string) => {
    if (evaluation_result_id !== undefined) {
      try {
        const result = await appDispatch(
          setEvaluationResultStatus({
            id: parseInt(evaluation_result_id),
            status,
          })
        )
        if (result.type === "evaluationResult/setEvaluationResultStatus/fulfilled") {
          navigate(`/admin/evaluation-administrations/${id}/evaluees`)
        }
        if (result.type === "evaluationResult/setEvaluationResultStatus/rejected") {
          navigate(
            `/admin/evaluation-administrations/${id}/evaluees/${evaluation_result_id}/evaluators/${result.payload.data.template_id}`
          )
          appDispatch(
            setAlert({
              description: result.payload.message,
              variant: "destructive",
            })
          )
        }
      } catch (error) {}
    }
  }

  const handleAddNew = () => {
    navigate(
      `/admin/external-evaluators/create?callback=${location.pathname}&evaluation_administration=${id}&evaluation_template=${evaluation_template_id}&evaluation_result=${evaluation_result_id}&evaluee=${evaluations[0].evaluee?.id}`
    )
  }

  const getAvailableProjects = (evaluatorId?: number) => {
    const existingProjectIds = sortedExternalEvaluations
      .filter(
        (evaluation) => evaluation.evaluator?.id === evaluatorId && evaluation.project !== null
      )
      .map((evaluation) => evaluation.project?.id)
    return project_members.filter(
      (project_member) => !existingProjectIds.includes(project_member.project?.id)
    )
  }

  const setProject = (id: number, project_id?: number, project_member_id?: number) => {
    void appDispatch(
      updateProject({
        id,
        evaluation_data: {
          project_id,
          project_member_id,
        },
      })
    )
  }

  return (
    <div className='flex-1 h-[calc(100vh_-_185px)] flex flex-col pt-4'>
      <PageSubTitle>Evaluators</PageSubTitle>
      <div className='flex-1 overflow-y-scroll mt-2'>
        <table className='relative w-full'>
          <thead className='sticky top-0 bg-white text-left'>
            <tr>
              <th className='pb-3'>
                <Checkbox
                  checked={
                    sortedEvaluations.length > 0 &&
                    sortedEvaluations.every((evaluation) => evaluation.for_evaluation)
                  }
                  onChange={(checked) => handleSelectAll(checked, false)}
                />
              </th>
              <th className='pb-3'>Evaluator</th>
              <th className='pb-3'>Project</th>
              <th className='pb-3'>Evaluee Role</th>
              <th className='pb-3'>%</th>
              <th className='pb-3'>Duration</th>
            </tr>
          </thead>
          <tbody>
            {sortedEvaluations
              .filter(
                (evaluation) => evaluation.is_external === undefined || !evaluation.is_external
              )
              .map((evaluation) => (
                <tr key={evaluation.id}>
                  <td className='pb-2'>
                    <Checkbox
                      checked={evaluation.for_evaluation}
                      onChange={(checked) => handleClickCheckbox(evaluation.id, checked)}
                    />
                  </td>
                  <td className='pb-2'>
                    {evaluation.evaluator?.last_name}, {evaluation.evaluator?.first_name}
                  </td>
                  <td className='pb-2'>{evaluation.project?.name}</td>
                  <td className='pb-2'>{evaluation.project_role?.name}</td>
                  <td className='pb-2'>{evaluation.percent_involvement}%</td>
                  <td className='pb-2'>
                    {formatDate(evaluation.eval_start_date)} to{" "}
                    {formatDate(evaluation.eval_end_date)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className='pt-5'>
        <PageSubTitle>External Evaluators</PageSubTitle>
      </div>
      <div className='flex-1 overflow-y-scroll my-2'>
        <table className='relative w-full'>
          <thead className='sticky top-0 bg-white text-left'>
            <tr>
              <th className='pb-3'>
                <Checkbox
                  checked={
                    sortedExternalEvaluations.length > 0 &&
                    sortedExternalEvaluations.every((evaluation) => evaluation.for_evaluation)
                  }
                  onChange={(checked) => handleSelectAll(checked, true)}
                />
              </th>
              <th className='pb-3'>Evaluator</th>
              <th className='pb-3'>Email address</th>
              <th className='pb-3'>Evaluee Role</th>
              <th className='pb-3'>Project</th>
            </tr>
          </thead>
          <tbody>
            {sortedExternalEvaluations
              .filter((evaluation) => evaluation.is_external === true)
              .map((evaluation) => (
                <tr key={evaluation.id}>
                  <td className='pb-2'>
                    <Checkbox
                      checked={evaluation.for_evaluation}
                      onChange={(checked) => handleClickCheckbox(evaluation.id, checked)}
                    />
                  </td>
                  <td className='pb-2'>
                    {evaluation.evaluator?.last_name}, {evaluation.evaluator?.first_name}
                  </td>
                  <td className='pb-2'>{evaluation.evaluator?.email}</td>
                  <td className='pb-2'>{evaluation.evaluator?.role}</td>
                  {evaluation.project === null &&
                  getAvailableProjects(evaluation.evaluator?.id).length > 0 ? (
                    <td>
                      <Dropdown>
                        <Dropdown.Trigger>
                          <Button variant='primaryOutline' size='small'>
                            Select project
                          </Button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                          {getAvailableProjects(evaluation.evaluator?.id).map(
                            (projectMember, index) => (
                              <React.Fragment key={index}>
                                <Dropdown.Item
                                  onClick={() =>
                                    setProject(
                                      evaluation.id,
                                      projectMember.project?.id,
                                      projectMember.id
                                    )
                                  }
                                >
                                  <div className='flex-flex-col'>
                                    <p className='text-sm font-bold text-start'>
                                      {projectMember.project?.name} -{" "}
                                      {projectMember.allocation_rate}%
                                    </p>
                                    <p className='text-sm'>
                                      {formatDate(projectMember.start_date)} to{" "}
                                      {formatDate(projectMember.end_date)}
                                    </p>
                                  </div>
                                </Dropdown.Item>
                              </React.Fragment>
                            )
                          )}
                        </Dropdown.Content>
                      </Dropdown>
                    </td>
                  ) : (
                    <td>{evaluation.project?.name}</td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className='flex gap-4 mt-3'>
        <Button variant='ghost' size='small' onClick={handleAddNew}>
          <Icon icon='Plus' color='primary' size='small' />
          <p className='text-primary-500 uppercase'>Add new</p>
        </Button>
        <LinkButton
          variant='ghost'
          size='small'
          to={`/admin/evaluation-administrations/${id}/evaluees/${evaluation_result_id}/evaluators/${evaluation_template_id}/select-external`}
        >
          <Icon icon='Plus' color='primary' size='small' />
          <p className='text-primary-500 uppercase'>Add from list</p>
        </LinkButton>
      </div>
      <div className='flex flex-col md:flex-row justify-between gap-2 pt-5'>
        <LinkButton
          variant='primaryOutline'
          to={`/admin/evaluation-administrations/${id}/evaluees`}
        >
          Back to Employee List
        </LinkButton>
        <div className='flex flex-col md:flex-row items-center gap-2'>
          <Button
            variant='primaryOutline'
            onClick={async () => await handleUpdateStatus(EvaluationResultStatus.Draft)}
            loading={loading === Loading.Pending}
          >
            Save as Draft
          </Button>
          <Button
            onClick={async () => await handleUpdateStatus(EvaluationResultStatus.Ready)}
            loading={loading === Loading.Pending}
          >
            Mark as Ready
          </Button>
        </div>
      </div>
    </div>
  )
}
