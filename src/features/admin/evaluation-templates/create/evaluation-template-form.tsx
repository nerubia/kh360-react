import { useNavigate, useSearchParams, useParams } from "react-router-dom"
import { Input } from "@components/ui/input/input"
import { CustomSelect } from "@components/ui/select/custom-select"
import { Button } from "@components/ui/button/button"
import { useEffect, useState } from "react"
import { CreateSelect } from "@components/ui/select/create-select"
import {
  createEvaluationTemplate,
  getTemplateTypes,
} from "@redux/slices/evaluation-templates-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { type Option } from "@custom-types/optionType"
import { type SingleValue } from "react-select"
import { type EvaluationTemplateFormData } from "@custom-types/form-data-type"
import { createEvaluationTemplateSchema } from "@utils/validation/evaluation-template-schema"
import { Loading } from "@custom-types/loadingType"
import { ValidationError } from "yup"
import { setAlert } from "@redux/slices/app-slice"
import { TemplateClass } from "@custom-types/evaluation-template-type"
import { getAllProjectRoles } from "@redux/slices/project-roles-slice"
import { getActiveAnswers } from "@redux/slices/answer-slice"
import { EvaluationTemplateContentsTable } from "@features/admin/evaluation-template-contents/evaluation-template-contents-table"
import { updateEvaluationTemplate } from "@redux/slices/evaluation-template-slice"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"
import { ToggleSwitch } from "@components/ui/toggle-switch/toggle-switch"

export const CreateEvaluationTemplateForm = () => {
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const callback = searchParams.get("callback")

  const appDispatch = useAppDispatch()

  const { answers } = useAppSelector((state) => state.answer)
  const { loading, template_types } = useAppSelector((state) => state.evaluationTemplates)
  const { evaluation_template_contents } = useAppSelector(
    (state) => state.evaluationTemplateContents
  )
  const { project_roles } = useAppSelector((state) => state.projectRoles)
  const { evaluation_template } = useAppSelector((state) => state.evaluationTemplate)
  const { id } = useParams()

  const [answerOptions, setAnswerOptions] = useState<Option[]>([])
  const [evaluaeeRoleOptions, setEvalueeRoleOptions] = useState<Option[]>([])
  const [evaluatorRoleOptions, setEvaluatorRoleOptions] = useState<Option[]>([])
  const [formData, setFormData] = useState<EvaluationTemplateFormData>({
    name: "",
    description: "",
    display_name: "",
    template_type: "",
    template_class: TemplateClass.Internal,
    with_recommendation: false,
    rate: "",
    is_active: 1,
    evaluation_template_contents: [],
  })
  const [templateTypeOptions, setTemplateTypeOptions] = useState<Option[]>([])
  const [validationErrors, setValidationErrors] = useState<Partial<EvaluationTemplateFormData>>({})
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false)
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)

  const templateClassOptions: Option[] = Object.values(TemplateClass).map((value) => ({
    label: value,
    value,
  }))

  useEffect(() => {
    void appDispatch(getTemplateTypes())
    void appDispatch(getAllProjectRoles())
    void appDispatch(getActiveAnswers())
  }, [])

  useEffect(() => {
    if (evaluation_template !== null) {
      setFormData({
        name: evaluation_template?.name,
        display_name: evaluation_template?.display_name,
        template_type: evaluation_template?.template_type,
        template_class: evaluation_template?.template_class,
        with_recommendation: +(evaluation_template?.with_recommendation ?? 0),
        evaluator_role_id: evaluation_template?.evaluatorRole?.id.toString(),
        evaluee_role_id: evaluation_template?.evalueeRole?.id.toString(),
        rate: evaluation_template?.rate,
        answer_id: evaluation_template?.answer?.id.toString(),
        is_active: +evaluation_template?.is_active,
        description: evaluation_template?.description ?? "",
        evaluation_template_contents: evaluation_template?.evaluationTemplateContents ?? [],
      })
    }
  }, [evaluation_template])

  useEffect(() => {
    const options: Option[] = answers.map((answer) => ({
      label: answer.name ?? "",
      value: answer.id.toString(),
    }))
    setAnswerOptions(options)
  }, [answers])

  useEffect(() => {
    let options: Option[] = project_roles.map((project_role) => ({
      label: project_role.short_name ?? "",
      value: project_role.id.toString(),
    }))
    setEvaluatorRoleOptions(options)

    options = project_roles
      .filter((project_role) => project_role.is_evaluee)
      .map((project_role) => ({
        label: project_role.short_name ?? "",
        value: project_role.id.toString(),
      }))
    setEvalueeRoleOptions(options)
  }, [project_roles])

  useEffect(() => {
    const options: Option[] = template_types
      .filter((type) => {
        return type.template_type !== undefined && type.template_type.length > 0
      })
      .sort((a, b) => {
        const templateTypeA = a.template_type ?? ""
        const templateTypeB = b.template_type ?? ""

        if (templateTypeA < templateTypeB) {
          return -1
        } else if (templateTypeA > templateTypeB) {
          return 1
        } else {
          return 0
        }
      })
      .map((evalTemplate) => ({
        label: evalTemplate.template_type ?? "",
        value: evalTemplate.template_type ?? "",
      }))
    setTemplateTypeOptions(options)
  }, [template_types])

  useEffect(() => {
    if (validationErrors.evaluation_template_contents !== undefined) {
      appDispatch(
        setAlert({
          description: validationErrors.evaluation_template_contents,
          variant: "destructive",
        })
      )
    }
  }, [validationErrors.evaluation_template_contents])

  const onChangeAnswer = async (option: SingleValue<Option>) => {
    const answer_id: string = option !== null ? option.value : ""
    setFormData({ ...formData, answer_id })
  }

  const onChangeEvaluaeeRole = async (option: SingleValue<Option>) => {
    const evaluee_role_id: string = option !== null ? option.value : ""
    setFormData({ ...formData, evaluee_role_id })
  }

  const onChangeEvaluatorRole = async (option: SingleValue<Option>) => {
    const evaluator_role_id: string = option !== null ? option.value : ""
    setFormData({ ...formData, evaluator_role_id })
  }

  const onChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const onChangeTemplateClass = async (option: SingleValue<Option>) => {
    const template_class: string = option !== null ? option.value : ""
    setFormData({ ...formData, template_class })
  }

  const onChangeTemplateType = async (option: SingleValue<Option>) => {
    const template_type: string = option !== null ? option.value : ""
    setFormData({ ...formData, template_type })
  }

  const onChangeWithRecommendation = async (checked: number) => {
    setFormData({ ...formData, with_recommendation: checked })
  }

  const onChangeIsActive = async (checked: number) => {
    setFormData({ ...formData, is_active: checked })
  }

  const checkNumberValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setFormData({ ...formData, rate: handleDecimalsOnValue(inputValue) })
  }

  const handleDecimalsOnValue = (value: string) => {
    const regex = /([0-9]*[.|,]{0,1}[0-9]{0,2})/s
    const matchResult = value.match(regex)

    if (matchResult !== null) {
      const parsedValue = parseFloat(matchResult[0].replace(",", "."))
      if (!isNaN(parsedValue) && parsedValue <= 100) {
        return matchResult[0]
      }
    }
    if (value.length === 0) {
      return ""
    }
    return formData.rate
  }

  const handleSubmit = async () => {
    try {
      const assignedTemplateContents = evaluation_template_contents.map((content, index) => ({
        ...content,
        sequence_no: index + 1,
      }))

      Object.assign(formData, {
        evaluation_template_contents: assignedTemplateContents,
      })
      await createEvaluationTemplateSchema.validate(formData, {
        abortEarly: false,
      })

      const result = await appDispatch(createEvaluationTemplate(formData))
      if (result.type === "evaluationTemplate/createEvaluationTemplate/rejected") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      }
      if (result.type === "evaluationTemplate/createEvaluationTemplate/fulfilled") {
        navigate(callback ?? "/admin/evaluation-templates")
        appDispatch(
          setAlert({
            description: "Added new evaluation template",
            variant: "success",
          })
        )
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<EvaluationTemplateFormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof EvaluationTemplateFormData] = err.message
        })
        setValidationErrors(errors)
      }
    }
  }

  const handleEdit = async () => {
    if (id !== undefined) {
      try {
        const assignedTemplateContents = evaluation_template_contents.map((content, index) => ({
          ...content,
          sequence_no: index + 1,
        }))

        Object.assign(formData, {
          evaluation_template_contents: assignedTemplateContents,
        })
        await createEvaluationTemplateSchema.validate(formData, {
          abortEarly: false,
        })
        const result = await appDispatch(
          updateEvaluationTemplate({
            id: parseInt(id),
            evaluation_template_data: formData,
          })
        )
        if (result.type === "evaluationTemplate/updateEvaluationTemplate/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
        if (result.type === "evaluationTemplate/updateEvaluationTemplate/fulfilled") {
          navigate(`/admin/evaluation-templates/${result.payload.id}`)
          appDispatch(
            setAlert({
              description: "Updated evaluation template",
              variant: "success",
            })
          )
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          const errors: Partial<EvaluationTemplateFormData> = {}
          error.inner.forEach((err) => {
            if (err.path !== undefined) {
              errors[err.path as keyof EvaluationTemplateFormData] = err.message
            }
          })
          setValidationErrors(errors)
        }
      }
    }
  }

  const handleCancel = () => {
    navigate(
      evaluation_template === null
        ? `/admin/evaluation-templates`
        : callback ?? `/admin/evaluation-templates/${id}`
    )
  }

  const toggleCancelDialog = () => {
    setShowCancelDialog((prev) => !prev)
  }

  const toggleSaveDialog = () => {
    setShowSaveDialog((prev) => !prev)
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-wrap gap-4'>
          <div className='flex-1'>
            <Input
              label='Name'
              name='name'
              placeholder='Name'
              value={formData.name}
              onChange={onChangeInput}
              error={validationErrors.name}
            />
          </div>
          <div className='flex-1'>
            <Input
              label='Display Name'
              name='display_name'
              placeholder='Display name'
              value={formData.display_name}
              onChange={onChangeInput}
              error={validationErrors.display_name}
            />
          </div>
        </div>
        <div className='flex flex-wrap gap-4'>
          <div className='flex-1'>
            <CreateSelect
              data-test-id='SelectTemplateType'
              label='Template Type'
              name='template_type'
              value={templateTypeOptions.find((option) => option.value === formData.template_type)}
              onChange={async (option) => await onChangeTemplateType(option)}
              options={templateTypeOptions}
              fullWidth
              isClearable
              error={validationErrors.template_type}
            />
          </div>
          <div className='flex-1'>
            <CustomSelect
              data-test-id='SelectTemplateClass'
              label='Template Class'
              name='template_class'
              value={templateClassOptions.find(
                (option) => option.value === formData.template_class
              )}
              onChange={async (option) => await onChangeTemplateClass(option)}
              options={templateClassOptions}
              fullWidth
              error={validationErrors.template_class}
            />
          </div>
          <div className='flex-1'>
            <CustomSelect
              data-test-id='SelectEvaluatorRole'
              label='Evaluator Role'
              name='evaluator_role_id'
              value={evaluatorRoleOptions.find(
                (option) => option.value === formData.evaluator_role_id
              )}
              onChange={async (option) => await onChangeEvaluatorRole(option)}
              options={evaluatorRoleOptions}
              fullWidth
              error={validationErrors.evaluator_role_id}
            />
          </div>
          <div className='flex-1'>
            <CustomSelect
              data-test-id='SelectEvalueeRole'
              label='Evaluee Role'
              name='evaluee_role_id'
              value={evaluaeeRoleOptions.find(
                (option) => option.value === formData.evaluee_role_id
              )}
              onChange={async (option) => await onChangeEvaluaeeRole(option)}
              options={evaluaeeRoleOptions}
              fullWidth
              error={validationErrors.evaluee_role_id}
            />
          </div>
        </div>
        <div className='xl:flex xl:flex-wrap gap-4'>
          <div className='flex-1'>
            <CustomSelect
              data-test-id='SelectAnswer'
              label='Answer'
              name='answer_id'
              value={answerOptions.find((option) => option.value === formData.answer_id)}
              onChange={async (option) => await onChangeAnswer(option)}
              options={answerOptions}
              fullWidth
              error={validationErrors.answer_id}
            />
          </div>
          <div
            className={`flex flex-1 gap-2 ${
              validationErrors.rate !== undefined ? "items-center" : "items-end"
            }`}
          >
            <Input
              label='Rate'
              step={0.01}
              name='rate'
              type='number'
              placeholder='Rate'
              value={formData.rate}
              onChange={(event) => checkNumberValue(event)}
              min={0}
              max={100}
              error={validationErrors.rate}
            />
            <span className={`${validationErrors.rate !== undefined ? "" : "pb-2"}`}>%</span>
          </div>
          <div
            className={`flex flex-1 items-end my-2.5 ${
              validationErrors.rate !== undefined ? "mb-7" : ""
            }`}
          >
            <ToggleSwitch
              checked={formData.with_recommendation as boolean}
              onChange={async (checked) => {
                const valueToSet = checked ? 1 : 0
                await onChangeWithRecommendation(valueToSet)
              }}
            />
            <h2 className='font-medium'>With Recommendation</h2>
          </div>
          <div
            className={`flex flex-1 items-end my-2.5 ${
              validationErrors.rate !== undefined ? "mb-7" : ""
            }`}
          >
            <ToggleSwitch
              checked={formData.is_active as boolean}
              onChange={async (checked) => {
                const valueToSet = checked ? 1 : 0
                await onChangeIsActive(valueToSet)
              }}
            />
            <h2 className='font-medium'>Is Active</h2>
          </div>
        </div>
      </div>
      <EvaluationTemplateContentsTable />
      <div className='flex justify-between'>
        <Button variant='primaryOutline' onClick={toggleCancelDialog}>
          Cancel
        </Button>
        <Button onClick={toggleSaveDialog} loading={loading === Loading.Pending}>
          Save
        </Button>
      </div>
      <CustomDialog
        open={showSaveDialog}
        title='Save Evaluation Template'
        description='Are you sure you want to save this evaluation template?'
        onClose={toggleSaveDialog}
        onSubmit={async () => {
          toggleSaveDialog()
          evaluation_template === null ? await handleSubmit() : await handleEdit()
        }}
      />
      <CustomDialog
        open={showCancelDialog}
        title='Cancel'
        description={
          <>
            Are you sure you want to cancel? <br />
            If you cancel, your data won&apos;t be saved.
          </>
        }
        onClose={toggleCancelDialog}
        onSubmit={handleCancel}
      />
    </div>
  )
}
