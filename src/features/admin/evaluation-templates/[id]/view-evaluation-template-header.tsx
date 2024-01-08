import { useEffect, useState } from "react"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { useParams } from "react-router-dom"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { PageTitle } from "../../../../components/shared/page-title"
import { getEvaluationTemplate } from "../../../../redux/slices/evaluation-template-slice"
import { Checkbox } from "../../../../components/ui/checkbox/checkbox"

export const ViewEvaluationTemplateHeader = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { evaluation_template } = useAppSelector((state) => state.evaluationTemplate)
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluationTemplate(parseInt(id)))
    }
  }, [])

  useEffect(() => {
    if (evaluation_template?.with_recommendation !== undefined) {
      setIsChecked(evaluation_template.with_recommendation)
    }
  }, [evaluation_template])

  const handleChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-col justify-between items-start md:items-end mt-2 md:flex-row gap-5'>
          <div>
            <div className='flex gap-4 primary-outline items-end mb-4'>
              <PageTitle>
                {evaluation_template?.name} ({evaluation_template?.display_name})
              </PageTitle>
            </div>
            <div className='flex gap-3'>
              <div className='font-bold'>Template type: </div>
              <div>{evaluation_template?.template_type}</div>
            </div>
            <div className='flex gap-3'>
              <div className='font-bold'>Template class: </div>
              <div>{evaluation_template?.template_class}</div>
            </div>
            <div className='flex gap-3'>
              <div className='font-bold'>With Recommendation: </div>
              <div>
                <Checkbox checked={isChecked} onChange={handleChange} disabled={true} />
              </div>
            </div>
            <div className='flex gap-3'>
              <div className='font-bold'>Evaluator Role: </div>
              <div>{evaluation_template?.evaluatorRole?.short_name}</div>
            </div>
            <div className='flex gap-3'>
              <div className='font-bold'>Evaluee Role: </div>
              <div>{evaluation_template?.evalueeRole?.short_name}</div>
            </div>
            <div className='flex gap-3'>
              <div className='font-bold'>Rate: </div>
              <div>{Number(evaluation_template?.rate).toFixed(2)}%</div>
            </div>
            <div className='flex gap-3'>
              <div className='font-bold'>Answer: </div>
              <div>{evaluation_template?.answer?.name}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
