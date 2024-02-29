import { Suspense, lazy, useEffect, useState } from "react"
import { useSearchParams, useNavigate, useLocation } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import {
  deleteEvaluationTemplate,
  getEvaluationTemplates,
} from "@redux/slices/evaluation-templates-slice"
import { useAppSelector } from "@hooks/useAppSelector"
import { Button, LinkButton } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { Pagination } from "@components/shared/pagination/pagination"
import { setAlert, setPreviousUrl } from "@redux/slices/app-slice"
import { useFullPath } from "@hooks/use-full-path"
import { Badge } from "@components/ui/badge/badge"
import {
  evaluationTemplateColumns,
  type EvaluationTemplate,
} from "@custom-types/evaluation-template-type"
import { Table } from "@components/ui/table/table"

const EvaluationTemplateDialog = lazy(
  async () => await import("@features/admin/evaluation-templates/evaluation-templates-dialog")
)

export const EvaluationTemplatesTable = () => {
  const [searchParams] = useSearchParams()
  const location = useLocation()

  const appDispatch = useAppDispatch()
  const fullPath = useFullPath()
  const navigate = useNavigate()
  const { evaluation_templates, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.evaluationTemplates
  )

  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [selectedEvaluationTemplateId, setSelectedEvaluationTemplateId] = useState<number>()
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({})

  useEffect(() => {
    void appDispatch(
      getEvaluationTemplates({
        name: searchParams.get("name") ?? undefined,
        display_name: searchParams.get("display_name") ?? undefined,
        template_type: searchParams.get("template_type") ?? undefined,
        evaluator_role_id: searchParams.get("evaluator_role_id") ?? undefined,
        evaluee_role_id: searchParams.get("evaluee_role_id") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  useEffect(() => {
    if (evaluation_templates !== undefined) {
      evaluation_templates.map((content) => {
        return setCheckedItems((prevItems) => ({
          ...prevItems,
          [content.id]: content.with_recommendation ?? false,
        }))
      })
    }
  }, [evaluation_templates])

  const toggleDialog = (id: number | null, e: React.MouseEvent | null) => {
    if (e != null) {
      e.stopPropagation()
    }

    if (id !== null) {
      setSelectedEvaluationTemplateId(id)
    }

    setShowDialog((prev) => !prev)
  }

  const handleViewEvaluationTemplate = (id: number) => {
    appDispatch(setPreviousUrl(fullPath))
    navigate(`${id}`)
  }

  const handleDelete = async () => {
    if (selectedEvaluationTemplateId !== undefined) {
      try {
        const result = await appDispatch(deleteEvaluationTemplate(selectedEvaluationTemplateId))
        if (result.type === "evaluationTemplate/deleteEvaluationTemplate/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
        if (result.type === "evaluationTemplate/deleteEvaluationTemplate/fulfilled") {
          appDispatch(
            setAlert({
              description: "Evaluation template deleted successfully",
              variant: "success",
            })
          )
        }
      } catch (error) {}
    }
  }

  const renderCell = (item: EvaluationTemplate, column: unknown) => {
    switch (column) {
      case "Name":
        return `${item.name}`
      case "Display Name":
        return `${item.display_name}`
      case "Template Type":
        return `${item.template_type}`
      case "With Recommendation":
        return (
          <div className='flex justify-center'>
            <Badge variant={`${checkedItems[item.id] ? "green" : "red"}`} size='small'>
              {checkedItems[item.id] ? "YES" : "NO"}
            </Badge>
          </div>
        )
      case "Evaluator Role":
        return <div className='flex justify-center'>{item.evaluatorRole?.short_name}</div>
      case "Evaluee Role":
        return <div className='flex justify-center'>{item.evalueeRole?.short_name}</div>
      case "Rate":
        return <div className='flex justify-center'>{Number(item.rate).toFixed(2)}%</div>
      case "Actions":
        return (
          <div className='flex gap-2 justify-center'>
            <LinkButton
              testId='EditButton'
              variant='unstyled'
              to={`/admin/evaluation-templates/${item.id}/edit?callback=${location.pathname}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Icon icon='PenSquare' size='extraSmall' color='gray' />
            </LinkButton>
            <Button
              testId='DeleteButton'
              variant='unstyled'
              onClick={(e) => toggleDialog(item.id, e)}
            >
              <Icon icon='Trash' size='extraSmall' color='gray' />
            </Button>
          </div>
        )
    }
  }

  return (
    <div className='flex flex-col gap-8 overflow-x-auto'>
      <Table
        data={evaluation_templates}
        renderCell={renderCell}
        isRowClickable={true}
        onClickRow={handleViewEvaluationTemplate}
        columns={evaluationTemplateColumns}
      />
      <Suspense>
        <EvaluationTemplateDialog
          open={showDialog}
          title='Delete Evaluation Template'
          description={
            <>
              Are you sure you want to delete this template? <br />
              This will delete all evaluations associated with this template and cannot be reverted.
            </>
          }
          closeBtn='No'
          acceptBtn='Yes'
          onClose={(e) => toggleDialog(null, e)}
          onSubmit={async (e) => {
            await handleDelete()
            toggleDialog(null, e)
          }}
        />
      </Suspense>
      {totalPages !== 1 && (
        <div className='flex justify-center'>
          <Pagination
            hasPreviousPage={hasPreviousPage}
            hasNextPage={hasNextPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  )
}
