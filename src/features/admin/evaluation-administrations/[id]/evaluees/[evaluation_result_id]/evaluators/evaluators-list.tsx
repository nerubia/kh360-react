import React, { useEffect, useState, lazy, Suspense } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Button, LinkButton } from "@components/ui/button/button"
import { Checkbox } from "@components/ui/checkbox/checkbox"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import {
  deleteEvaluation,
  getEvaluations,
  setForEvaluations,
  updateProject,
} from "@redux/slices/evaluations-slice"
import { formatDate } from "@utils/format-date"
import { setEvaluationResultStatus } from "@redux/slices/evaluation-result-slice"
import { EvaluationResultStatus } from "@custom-types/evaluation-result-type"
import { Loading } from "@custom-types/loadingType"
import { setAlert } from "@redux/slices/app-slice"
import { type Evaluation } from "@custom-types/evaluation-type"
import { PageSubTitle } from "@components/shared/page-sub-title"
import { Icon } from "@components/ui/icon/icon"
import { setSelectedExternalUserIds } from "@redux/slices/evaluation-administration-slice"
import { getProjectMembers } from "@redux/slices/project-members-slice"
import Dropdown from "@components/ui/dropdown/dropdown"
import Tooltip from "@components/ui/tooltip/tooltip"
import { useMobileView } from "@hooks/use-mobile-view"
import { TemplateType } from "@custom-types/evaluation-template-type"
import { Table } from "@components/ui/table/table"
import { type ReactNode } from "react"

const EvaluationAdminDialog = lazy(
  async () =>
    await import("@features/admin/evaluation-administrations/evaluation-administrations-dialog")
)
export const EvaluatorsList = () => {
  const navigate = useNavigate()
  const { id, evaluation_result_id, evaluation_template_id } = useParams()
  const appDispatch = useAppDispatch()
  const location = useLocation()
  const { loading } = useAppSelector((state) => state.evaluationResult)
  const { evaluations } = useAppSelector((state) => state.evaluations)
  const { project_members } = useAppSelector((state) => state.projectMembers)
  const { evaluation_templates } = useAppSelector((state) => state.evaluationTemplates)
  const [sortedEvaluations, setSortedEvaluations] = useState<Evaluation[]>([])
  const [sortedExternalEvaluations, setSortedExternalEvaluations] = useState<Evaluation[]>([])
  const [internalHeader, setInternalHeader] = useState<string>("")
  const [externalHeader, setExternalHeader] = useState<string>("")
  const [showSelectProjectButton, setShowSelectProjectButton] = useState<boolean>(false)

  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<number>()
  const isMediumSize = useMobileView(1200)
  const isSmallDevice = useMobileView(800)

  const columns = [
    <Checkbox
      key={0}
      checked={
        sortedEvaluations.length > 0 &&
        sortedEvaluations.every((evaluation) => evaluation.for_evaluation)
      }
      onChange={(checked) => handleSelectAll(checked, false)}
    />,
    "Evaluator",
    "Project",
    "Role",
    "%",
    "Duration",
  ]

  const columnsExternal = [
    <Checkbox
      key={0}
      checked={
        sortedExternalEvaluations.length > 0 &&
        sortedExternalEvaluations.every((evaluation) => evaluation.for_evaluation)
      }
      onChange={(checked) => handleSelectAll(checked, true)}
    />,
    "Evaluator",
    "Project",
    "%",
    "Duration",
    "Actions",
  ]

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
    if (evaluation_template_id !== undefined) {
      const template = evaluation_templates.find(
        (template) => parseInt(evaluation_template_id) === template.id
      )
      if (template !== undefined && template !== null) {
        const role =
          template?.project_role?.name !== undefined
            ? ` for ${template?.project_role?.name} Role`
            : ""
        setInternalHeader(`${template?.display_name}${role}`)
        setExternalHeader(`External Evaluators${role}`)
        if (template.template_type === TemplateType.ProjectEvaluation) {
          setShowSelectProjectButton(true)
        } else {
          setShowSelectProjectButton(false)
        }
      }
    }
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

  const toggleDialog = (id: number | null) => {
    if (id !== null) {
      setSelectedEvaluationId(id)
    }
    setShowDialog((prev) => !prev)
  }

  const handleDelete = async () => {
    if (selectedEvaluationId !== undefined) {
      try {
        const result = await appDispatch(deleteEvaluation(selectedEvaluationId))
        if (result.type === "evaluations/deleteEvaluation/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
        if (result.type === "evaluations/deleteEvaluation/fulfilled") {
          appDispatch(
            setAlert({
              description: "Evaluator deleted successfully",
              variant: "success",
            })
          )
        }
      } catch (error) {}
    }
  }

  const renderCell = (item: Evaluation, column: ReactNode, index: number) => {
    switch (index) {
      case 0:
        return (
          <Checkbox
            checked={item.for_evaluation}
            onChange={(checked) => handleClickCheckbox(item.id, checked)}
          />
        )
      case 1:
        return `${item.evaluator?.last_name}, ${item.evaluator?.first_name}`
      case 2:
        return item.project?.name !== undefined ? `${item.project?.name}` : null
      case 3:
        return item.project_role?.short_name !== undefined
          ? `${item.project_role?.short_name}`
          : null
      case 4:
        return `${item.percent_involvement}%`
      case 5:
        return `${formatDate(item.eval_start_date)} to 
                            ${formatDate(item.eval_end_date)}`
    }
  }

  const renderExternalCell = (item: Evaluation, column: unknown, index: number) => {
    switch (index) {
      case 0:
        return (
          <Checkbox
            checked={item.for_evaluation}
            onChange={(checked) => handleClickCheckbox(item.id, checked)}
          />
        )
      case 1:
        return (
          <Tooltip placement='topStart'>
            <Tooltip.Trigger>
              {`${item.evaluator?.last_name?.substring(0, 12)}${
                item.evaluator?.last_name != null && item.evaluator?.last_name.length > 12
                  ? "..."
                  : ""
              }, ${item.evaluator?.first_name?.substring(0, 20)}${
                item.evaluator?.first_name != null && item.evaluator?.first_name.length > 20
                  ? "..."
                  : ""
              }`}
            </Tooltip.Trigger>
            <Tooltip.Content>{item.evaluator?.email}</Tooltip.Content>
          </Tooltip>
        )
      case 2:
        return showSelectProjectButton ? (
          <Dropdown>
            <Dropdown.Trigger>
              <Button variant='primaryOutline' size='small'>
                {item.project !== null ? item.project?.name : "Select project"}
              </Button>
            </Dropdown.Trigger>
            <Dropdown.Content>
              {getAvailableProjects(item.evaluator?.id).map((projectMember, index) => (
                <React.Fragment key={index}>
                  <Dropdown.Item
                    onClick={() => setProject(item.id, projectMember.project?.id, projectMember.id)}
                  >
                    <div className='flex-flex-col'>
                      <p className='text-sm font-bold text-start'>
                        {projectMember.project?.name} [{projectMember.role}] -{" "}
                        {projectMember.allocation_rate}%
                      </p>
                      <p className='text-sm'>
                        {formatDate(projectMember.start_date)} to{" "}
                        {formatDate(projectMember.end_date)}
                      </p>
                    </div>
                  </Dropdown.Item>
                </React.Fragment>
              ))}
            </Dropdown.Content>
          </Dropdown>
        ) : null
      case 3:
        return item.percent_involvement !== null ? `${item.percent_involvement}%` : null
      case 4:
        return item.eval_start_date !== null && item.eval_end_date !== null
          ? `${formatDate(item.eval_start_date)} to ${formatDate(item.eval_end_date)}`
          : null
      case 5:
        return (
          <Button testId='DeleteButton' variant='unstyled' onClick={() => toggleDialog(item.id)}>
            <Icon icon='Trash' />
          </Button>
        )
    }
  }

  return (
    <div className='flex-1 h-screen lg:calc-screen flex flex-col pt-4 overflow-x-auto overflow-y-auto text-sm xl:text-lg'>
      <PageSubTitle>{internalHeader}</PageSubTitle>
      <div className='flex-1 overflow-y-scroll mt-2'>
        <Table
          columns={columns}
          data={sortedEvaluations}
          renderCell={renderCell}
          overflowYHidden={false}
        />
      </div>
      <div className='pt-5'>
        <PageSubTitle>{externalHeader}</PageSubTitle>
      </div>
      <div className='flex-1 overflow-y-scroll my-2 overflow-x-auto'>
        <Table
          columns={columnsExternal}
          data={sortedExternalEvaluations}
          renderCell={renderExternalCell}
          overflowYHidden={false}
        />
      </div>
      <div className='flex gap-4 mt-3'>
        <Button variant='ghost' size='small' onClick={handleAddNew}>
          <Icon icon='Plus' color='primary' size='small' />
          <p className='text-primary-500 uppercase whitespace-nowrap text-xs'>Add new</p>
        </Button>
        <LinkButton
          variant='ghost'
          size='small'
          to={`/admin/evaluation-administrations/${id}/evaluees/${evaluation_result_id}/evaluators/${evaluation_template_id}/select-external`}
        >
          <Icon icon='Plus' color='primary' size='small' />
          <p className='text-primary-500 uppercase whitespace-nowrap text-xs'>Add from list</p>
        </LinkButton>
      </div>
      <div className='flex flex-col md:flex-row justify-between gap-2 pt-5 whitespace-nowrap'>
        <LinkButton
          fullWidth={isSmallDevice}
          size={isMediumSize ? "small" : "medium"}
          variant='primaryOutline'
          to={`/admin/evaluation-administrations/${id}/evaluees`}
        >
          Back to Employee List
        </LinkButton>
        <div className='flex flex-col md:flex-row items-center gap-2'>
          <Button
            fullWidth={isMediumSize}
            size={isMediumSize ? "small" : "medium"}
            variant='primaryOutline'
            onClick={async () => await handleUpdateStatus(EvaluationResultStatus.Draft)}
            loading={loading === Loading.Pending}
          >
            Save as Draft
          </Button>

          <Button
            fullWidth={isMediumSize}
            size={isMediumSize ? "small" : "medium"}
            onClick={async () => await handleUpdateStatus(EvaluationResultStatus.Ready)}
            loading={loading === Loading.Pending}
          >
            Mark as Ready
          </Button>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <EvaluationAdminDialog
          open={showDialog}
          title='Delete Evaluator'
          description={
            <>
              Are you sure you want to delete this evaluator? <br />
              This will delete all evaluations associated with this evaluator and cannot be
              reverted.
            </>
          }
          onClose={() => toggleDialog(null)}
          onSubmit={async () => {
            await handleDelete()
            toggleDialog(null)
          }}
        />
      </Suspense>
    </div>
  )
}
