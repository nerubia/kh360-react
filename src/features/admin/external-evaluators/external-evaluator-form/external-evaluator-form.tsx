import { useState, useEffect, lazy, Suspense } from "react"
import { Input } from "@components/ui/input/input"
import { type ExternalUserFormData } from "@custom-types/form-data-type"
import { Button } from "@components/ui/button/button"
import { ValidationError } from "yup"
import { createExternalUserSchema } from "@utils/validation/external-evaluator-schema"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { setAlert } from "@redux/slices/app-slice"
import { useAppSelector } from "@hooks/useAppSelector"
import { Loading } from "@custom-types/loadingType"
import { createExternalUser, updateExternalUser } from "@redux/slices/external-users-slice"
import { addExternalEvaluators } from "@redux/slices/evaluation-administration-slice"
import { getActiveTemplates } from "@redux/slices/evaluation-templates-slice"
import { CustomSelect } from "@components/ui/select/custom-select"
import { type Option } from "@custom-types/optionType"

export const ExternalEvaluatorForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const callback = searchParams.get("callback")
  const evaluation_administration_id = searchParams.get("evaluation_administration")
  const evaluation_template_id = searchParams.get("evaluation_template")
  const evaluation_result_id = searchParams.get("evaluation_result")
  const evaluee_id = searchParams.get("evaluee")

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    evaluation_template_id ?? "all"
  )

  const appDispatch = useAppDispatch()
  const { external_user } = useAppSelector((state) => state.externalUser)
  const { loading } = useAppSelector((state) => state.externalUsers)
  const { evaluation_templates } = useAppSelector((state) => state.evaluationTemplates)

  const [formData, setFormData] = useState<ExternalUserFormData>({
    first_name: external_user?.first_name ?? "",
    middle_name: external_user?.middle_name ?? "",
    last_name: external_user?.last_name ?? "",
    email: external_user?.email ?? "",
    role: external_user?.role ?? "",
    company: external_user?.company ?? "",
  })
  const [validationErrors, setValidationErrors] = useState<Partial<ExternalUserFormData>>({})
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [activeTemplates, setActiveTemplates] = useState<Option[]>([])

  const ExternalEvaluatorsDialog = lazy(
    async () => await import("@features/admin/external-evaluators/external-evaluators-dialog")
  )

  useEffect(() => {
    void appDispatch(getActiveTemplates())
  }, [])

  useEffect(() => {
    const templates = [...evaluation_templates]
    const options: Option[] = templates.map((template) => {
      const role =
        template?.project_role?.name !== undefined
          ? ` for ${template?.project_role?.name} Role`
          : ""
      return {
        label: `${template.display_name}${role}`,
        value: template.id.toString(),
      }
    })
    setActiveTemplates(options)
  }, [evaluation_templates])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const toggleDialog = async () => {
    setShowDialog((prev) => !prev)
  }

  const handleSubmit = async () => {
    try {
      await createExternalUserSchema.validate(formData, {
        abortEarly: false,
      })
      const result = await appDispatch(createExternalUser(formData))
      if (result.type === "externalUser/createExternalUser/rejected") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      }
      if (result.type === "externalUser/createExternalUser/fulfilled") {
        if (
          evaluation_administration_id !== null &&
          evaluation_template_id !== null &&
          evaluation_result_id !== null &&
          evaluee_id !== null
        ) {
          try {
            const resultExternal = await appDispatch(
              addExternalEvaluators({
                id: parseInt(evaluation_administration_id),
                evaluation_template_id:
                  parseInt(selectedTemplateId) ?? parseInt(evaluation_template_id),
                evaluation_result_id: parseInt(evaluation_result_id),
                evaluee_id: parseInt(evaluee_id),
                external_user_ids: [result.payload.id],
              })
            )
            if (resultExternal.payload.id !== undefined) {
              if (selectedTemplateId !== undefined) {
                const updatedCallback = callback?.replace(/\/\d+$/, `/${selectedTemplateId}`)
                navigate(updatedCallback ?? "/admin/external-evaluators")
              } else {
                navigate(callback ?? "/admin/external-evaluators")
              }
              appDispatch(
                setAlert({
                  description: "Added new external evaluator",
                  variant: "success",
                })
              )
            } else if (typeof resultExternal.payload === "string") {
              appDispatch(
                setAlert({
                  description: resultExternal.payload,
                  variant: "destructive",
                })
              )
            }
          } catch (error) {}
        } else {
          navigate(callback ?? "/admin/external-evaluators")
          appDispatch(
            setAlert({
              description: "Added new external evaluator",
              variant: "success",
            })
          )
        }
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<ExternalUserFormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof ExternalUserFormData] = err.message
        })
        setValidationErrors(errors)
      }
    }
  }

  const handleUpdate = async () => {
    if (external_user !== null) {
      try {
        await createExternalUserSchema.validate(formData, {
          abortEarly: false,
        })
        const result = await appDispatch(
          updateExternalUser({
            id: external_user?.id,
            external_user_data: formData,
          })
        )
        if (result.type === "externalUser/updateExternalUser/fulfilled") {
          navigate(callback ?? "/admin/external-evaluators")
          appDispatch(
            setAlert({
              description: "Updated successfully",
              variant: "success",
            })
          )
        }
        if (result.type === "externalUser/updateExternalUser/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          const errors: Partial<ExternalUserFormData> = {}
          error.inner.forEach((err) => {
            errors[err.path as keyof ExternalUserFormData] = err.message
          })
          setValidationErrors(errors)
        }
      }
    }
  }

  const handleCancel = () => {
    navigate(callback ?? "/admin/external-evaluators")
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col md:w-1/2 gap-4'>
        <div className='flex flex-wrap gap-4'>
          <div className='flex-1'>
            <Input
              label='First name'
              name='first_name'
              placeholder='First name'
              value={formData.first_name}
              onChange={handleInputChange}
              error={validationErrors.first_name}
              maxLength={100}
            />
          </div>
          <div className='flex-1'>
            <Input
              label='Middle name'
              name='middle_name'
              placeholder='Middle name'
              value={formData.middle_name}
              onChange={handleInputChange}
              error={validationErrors.middle_name}
              maxLength={75}
            />
          </div>
          <div className='flex-1'>
            <Input
              label='Last name'
              name='last_name'
              placeholder='Last name'
              value={formData.last_name}
              onChange={handleInputChange}
              error={validationErrors.last_name}
              maxLength={75}
            />
          </div>
        </div>
        <Input
          label='Email'
          name='email'
          placeholder='Email'
          value={formData.email}
          onChange={handleInputChange}
          error={validationErrors.email}
          maxLength={255}
        />
        <Input
          label='Role'
          name='role'
          placeholder='Role'
          value={formData.role}
          onChange={handleInputChange}
          error={validationErrors.role}
          maxLength={255}
        />
        <Input
          label='Company'
          name='company'
          placeholder='Company'
          value={formData.company}
          onChange={handleInputChange}
          error={validationErrors.company}
          maxLength={255}
        />
        {callback !== null && (
          <CustomSelect
            data-test-id='SelectEvaluationTemplate'
            label='Evaluation Template'
            name='evaluation_template'
            value={activeTemplates.find((option) =>
              option.value === selectedTemplateId ? option.label : ""
            )}
            onChange={(option) => setSelectedTemplateId(option !== null ? option.value : "all")}
            options={activeTemplates}
            fullWidth={true}
          />
        )}
      </div>
      <div className='flex justify-between md:w-1/2'>
        <Button variant='primaryOutline' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button
          onClick={external_user === null ? handleSubmit : handleUpdate}
          loading={loading === Loading.Pending}
        >
          Save
        </Button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ExternalEvaluatorsDialog
          open={showDialog}
          title='Cancel'
          description={
            <>
              Are you sure you want to cancel? <br />
              If you cancel, your data won&apos;t be saved.
            </>
          }
          onClose={toggleDialog}
          onSubmit={handleCancel}
        />
      </Suspense>
    </div>
  )
}
