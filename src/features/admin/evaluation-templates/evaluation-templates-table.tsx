import { useEffect, useState } from "react"
import { useSearchParams, useNavigate, useLocation } from "react-router-dom"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import {
  deleteEvaluationTemplate,
  getEvaluationTemplates,
} from "../../../redux/slices/evaluation-templates-slice"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { Button, LinkButton } from "../../../components/ui/button/button"
import { Icon } from "../../../components/ui/icon/icon"
import { Pagination } from "../../../components/shared/pagination/pagination"
import Dialog from "../../../components/ui/dialog/dialog"
import { setAlert, setPreviousUrl } from "../../../redux/slices/app-slice"
import { useFullPath } from "../../../hooks/use-full-path"
import { Badge } from "../../../components/ui/badge/badge"

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

  const toggleDialog = (id: number | null, e: React.MouseEvent) => {
    e.stopPropagation()
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

  return (
    <div className='flex flex-col gap-8'>
      <table className='w-full table-fixed'>
        <thead className='text-left'>
          <tr>
            <th className='pb-3 pr-2'>Name</th>
            <th className='pb-3 px-2'>Display Name</th>
            <th className='pb-3 px-2'>Template Type</th>
            <th className='pb-3 px-2 text-center'>With Recommendation</th>
            <th className='pb-3 px-2 text-center'>Evaluator Role</th>
            <th className='pb-3 px-2 text-center'>Evaluee Role</th>
            <th className='pb-3 px-2'>Rate</th>
            <th className='pb-3 px-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {evaluation_templates.map((evaluationTemplate) => (
            <tr
              key={evaluationTemplate.id}
              className=' hover:bg-slate-100 cursor-pointer'
              onClick={() => handleViewEvaluationTemplate(evaluationTemplate.id)}
            >
              <td className='py-1 pr-2'>{evaluationTemplate.name}</td>
              <td className='py-1 px-2'>{evaluationTemplate.display_name}</td>
              <td className='py-1 px-2'>{evaluationTemplate.template_type}</td>
              <td className='py-1 px-2 text-center'>
                <div className='flex items-center justify-center gap-4'>
                  <Badge
                    variant={`${checkedItems[evaluationTemplate.id] ? "green" : "red"}`}
                    size='small'
                  >
                    {checkedItems[evaluationTemplate.id] ? "YES" : "NO"}
                  </Badge>
                </div>
              </td>
              <td className='py-1 px-2 text-center'>
                {evaluationTemplate.evaluatorRole?.short_name}
              </td>
              <td className='py-1 px-2 text-center'>
                {evaluationTemplate.evalueeRole?.short_name}
              </td>
              <td className='py-1 px-2'>{Number(evaluationTemplate.rate).toFixed(2)}%</td>
              <td className='py-1 px-2 flex gap-2'>
                <LinkButton
                  testId='EditButton'
                  variant='unstyled'
                  to={`/admin/evaluation-templates/${evaluationTemplate.id}/edit?callback=${location.pathname}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon icon='PenSquare' />
                </LinkButton>
                <Button
                  testId='DeleteButton'
                  variant='unstyled'
                  onClick={(e) => toggleDialog(evaluationTemplate.id, e)}
                >
                  <Icon icon='Trash' />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={showDialog}>
        <Dialog.Title>Delete Evaluation Template</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete this template? <br />
          This will delete all evaluations associated with this template and cannot be reverted.
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={(e) => toggleDialog(null, e)}>
            No
          </Button>
          <Button
            variant='primary'
            onClick={async (e) => {
              await handleDelete()
              toggleDialog(null, e)
            }}
          >
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
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
