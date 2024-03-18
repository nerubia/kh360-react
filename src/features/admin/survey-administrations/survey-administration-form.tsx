import { Suspense, lazy, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ValidationError } from "yup"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Button } from "@components/ui/button/button"
import { Input } from "@components/ui/input/input"
import { TextArea } from "@components/ui/textarea/text-area"
import { Loading } from "@custom-types/loadingType"
import { getByTemplateType } from "@redux/slices/email-template-slice"
import { type SurveyAdministrationFormData } from "@custom-types/form-data-type"
import { createSurveyAdministration } from "@redux/slices/survey-administration-slice"
import { setAlert } from "@redux/slices/app-slice"
import { DateRangePicker } from "@components/ui/date-range-picker/date-range-picker"
import { type DateValueType, type DateType } from "react-tailwindcss-datepicker"
import { createSurveyAdministrationSchema } from "@utils/validation/survey-administration-schema"
import { CustomSelect } from "@components/ui/select/custom-select"
import { type Option } from "@custom-types/optionType"
import { type SingleValue } from "react-select"
import { getAllSurveyTemplates } from "@redux/slices/survey-templates-slice"

const EvaluationAdminDialog = lazy(
  async () =>
    await import("@features/admin/evaluation-administrations/evaluation-administrations-dialog")
)

export const SurveyAdministrationForm = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.evaluationAdministrations)
  const { emailTemplate } = useAppSelector((state) => state.emailTemplate)
  const { survey_templates } = useAppSelector((state) => state.surveyTemplates)

  const [surveyTemplateOptions, setSurveyTemplateOptions] = useState<Option[]>([])

  const [formData, setFormData] = useState<SurveyAdministrationFormData>({
    name: "",
    survey_start_date: "",
    survey_end_date: "",
    survey_template_id: "",
    remarks: "",
    email_subject: "",
    email_content: "",
  })
  const [validationErrors, setValidationErrors] = useState<Partial<SurveyAdministrationFormData>>(
    {}
  )
  const [showDialog, setShowDialog] = useState<boolean>(false)

  useEffect(() => {
    void appDispatch(getByTemplateType("Create Survey"))
    void appDispatch(getAllSurveyTemplates())
  }, [])

  useEffect(() => {
    const filterOptions: Option[] = survey_templates.map((surveyTemplate) => ({
      label: surveyTemplate.name ?? "",
      value: surveyTemplate.id?.toString() ?? "",
    }))
    setSurveyTemplateOptions(filterOptions)
  }, [survey_templates])

  useEffect(() => {
    if (emailTemplate !== null) {
      setFormData({
        ...formData,
        email_subject: emailTemplate?.subject,
        email_content: emailTemplate?.content,
      })
    }
  }, [emailTemplate])

  const handleSubmit = async () => {
    try {
      await createSurveyAdministrationSchema.validate(formData, {
        abortEarly: false,
      })
      const result = await appDispatch(createSurveyAdministration(formData))
      if (result.type === "surveyAdministration/createSurveyAdministration/fulfilled") {
        navigate(`/admin/survey-administrations/${result.payload.id}/select`)
      }
      if (result.type === "surveyAdministration/createSurveyAdministration/rejected") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<SurveyAdministrationFormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof SurveyAdministrationFormData] = err.message
        })
        setValidationErrors(errors)
      }
    }
  }

  const handleChangeDateRange = (value: DateValueType, field: string) => {
    const startDate = value?.startDate != null ? value.startDate.toString().split("T")[0] : ""
    const endDate = value?.endDate != null ? value.endDate.toString().split("T")[0] : ""

    setFormData((prevFormData) => ({
      ...prevFormData,
      [`${field}_start_date`]: startDate,
      [`${field}_end_date`]: endDate,
    }))
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleTextAreaChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const onChangeTemplate = async (option: SingleValue<Option>) => {
    const template: string = option !== null ? option.value : ""
    setFormData({ ...formData, survey_template_id: template })
  }

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }
  const handleRedirect = () => {
    navigate(`/admin/survey-administrations`)
  }

  const dateLimit = (dateString: null | undefined | DateType) => {
    if (dateString != null) {
      const currentDate = new Date(dateString)
      currentDate.setDate(currentDate.getDate())
      return currentDate.toString()
    }
    return undefined
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col md:w-1/2 gap-4'>
        <div>
          <h2 className='font-medium'>Name</h2>
          <Input
            name='name'
            placeholder='Name'
            value={formData.name}
            onChange={handleInputChange}
            error={validationErrors.name}
            maxLength={100}
          />
        </div>
        <div className='flex flex-col'>
          <DateRangePicker
            name='survey_schedule'
            label='Schedule'
            value={{
              startDate: formData.survey_start_date ?? "",
              endDate: formData.survey_end_date ?? "",
            }}
            onChange={(value) => handleChangeDateRange(value, "survey")}
            error={{
              start_date: validationErrors.survey_start_date,
              end_date: validationErrors.survey_end_date,
            }}
            dateLimit={{
              start_date: dateLimit(new Date()),
            }}
          />
        </div>
        <CustomSelect
          data-test-id='SurveyTemplate'
          label='Survey Template'
          name='template'
          value={surveyTemplateOptions.find(
            (option) => option.value === formData?.survey_template_id
          )}
          onChange={async (option) => await onChangeTemplate(option)}
          options={surveyTemplateOptions}
          fullWidth
          error={validationErrors.survey_template_id}
          maxMenuHeight={160}
          isClearable
        />
      </div>
      <TextArea
        label='Description'
        name='remarks'
        placeholder='Some description'
        value={formData.remarks}
        onChange={handleTextAreaChange}
        error={validationErrors.remarks}
      />
      <div className='flex flex-col gap-4'>
        <h1 className='text-lg font-bold'>Email</h1>
        <Input
          label='Subject'
          name='email_subject'
          placeholder='Subject'
          value={formData.email_subject}
          onChange={handleInputChange}
          error={validationErrors.email_subject}
        />
        <TextArea
          label='Content'
          name='email_content'
          placeholder='Email content'
          value={formData.email_content}
          onChange={handleTextAreaChange}
          error={validationErrors.email_content}
        />
      </div>
      <div>
        <div className='flex justify-between'>
          <Button variant='primaryOutline' onClick={toggleDialog}>
            Cancel & Exit
          </Button>
          <Button onClick={handleSubmit} loading={loading === Loading.Pending}>
            Save & Proceed
          </Button>
        </div>
      </div>
      <Suspense>
        <EvaluationAdminDialog
          open={showDialog}
          title='Cancel & Exit'
          description={
            <>
              Are you sure you want to cancel and exit? <br />
              If you cancel, your data won&apos;t be saved.
            </>
          }
          onClose={toggleDialog}
          onSubmit={handleRedirect}
          loading={loading === Loading.Pending}
        />
      </Suspense>
    </div>
  )
}
