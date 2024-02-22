import { Suspense, lazy, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ValidationError } from "yup"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Button } from "@components/ui/button/button"
import { Input } from "@components/ui/input/input"
import { TextArea } from "@components/ui/textarea/text-area"
import { createEvaluationAdministrationSchema } from "@utils/validation/evaluation-administration-schema"
import { Loading } from "@custom-types/loadingType"
import { type EvaluationAdministrationFormData } from "@custom-types/form-data-type"
import {
  getEvaluationAdministration,
  updateEvaluationAdministration,
  setSelectedEmployeeIds,
} from "@redux/slices/evaluation-administration-slice"
import { setAlert } from "@redux/slices/app-slice"
import { getEvaluationResults } from "@redux/slices/evaluation-results-slice"
import { DateRangePicker } from "@components/ui/date-range-picker/date-range-picker"
import { type DateValueType } from "react-tailwindcss-datepicker"

const EvaluationAdminDialog = lazy(
  async () =>
    await import("@features/admin/evaluation-administrations/evaluation-administrations-dialog")
)

export const EditEvaluationAdministrationForm = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { id } = useParams()
  const { loading, error, evaluation_administration } = useAppSelector(
    (state) => state.evaluationAdministration
  )
  const { evaluation_results } = useAppSelector((state) => state.evaluationResults)
  const { emailTemplate } = useAppSelector((state) => state.emailTemplate)

  const [formData, setFormData] = useState<EvaluationAdministrationFormData>({
    name: "",
    eval_period_start_date: "",
    eval_period_end_date: "",
    eval_schedule_start_date: "",
    eval_schedule_end_date: "",
    remarks: "",
    email_subject: "",
    email_content: "",
  })
  const [validationErrors, setValidationErrors] = useState<
    Partial<EvaluationAdministrationFormData>
  >({})
  const [showDialog, setShowDialog] = useState<boolean>(false)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluationAdministration(parseInt(id)))
      void appDispatch(
        getEvaluationResults({
          evaluation_administration_id: id,
        })
      )
    }
  }, [])

  useEffect(() => {
    if (evaluation_administration !== null) {
      setFormData({
        name: evaluation_administration?.name,
        eval_period_start_date: evaluation_administration?.eval_period_start_date?.split("T")[0],
        eval_period_end_date: evaluation_administration?.eval_period_end_date?.split("T")[0],
        eval_schedule_start_date:
          evaluation_administration?.eval_schedule_start_date?.split("T")[0],
        eval_schedule_end_date: evaluation_administration?.eval_schedule_end_date?.split("T")[0],
        remarks: evaluation_administration?.remarks,
        email_subject: evaluation_administration?.email_subject,
        email_content: evaluation_administration?.email_content,
      })
    }
  }, [evaluation_administration])

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
    if (id !== undefined) {
      try {
        await createEvaluationAdministrationSchema.validate(formData, {
          abortEarly: false,
        })
        const result = await appDispatch(
          updateEvaluationAdministration({
            id: parseInt(id),
            evaluation_data: formData,
          })
        )
        if (result.type === "evaluationAdministration/updateEvaluationAdministration/fulfilled") {
          appDispatch(setSelectedEmployeeIds([]))
          appDispatch(
            setAlert({
              description: "Evaluation adminstration updated successfully",
              variant: "success",
            })
          )
          if (evaluation_results.length === 0) {
            navigate(`/admin/evaluation-administrations/${result.payload.id}/select`)
          } else {
            navigate(`/admin/evaluation-administrations/${result.payload.id}`)
          }
        }
        if (result.type === "evaluationAdministration/updateEvaluationAdministration/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          const errors: Partial<EvaluationAdministrationFormData> = {}
          error.inner.forEach((err) => {
            errors[err.path as keyof EvaluationAdministrationFormData] = err.message
          })
          setValidationErrors(errors)
        }
      }
    }
  }

  const handleChangeDateRange = (value: DateValueType, field: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field + "_start_date"]: value?.startDate?.toString().split("T")[0] ?? "",
      [field + "_end_date"]: value?.endDate?.toString().split("T")[0] ?? "",
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

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }
  const handleRedirect = () => {
    navigate(`/admin/evaluation-administrations/${id}`)
  }

  return (
    <>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled && evaluation_administration == null && (
        <div className='h-screen flex justify-center items-center'>
          <h1 className='text-3xl font-bold'>Not found 🤔</h1>
        </div>
      )}
      {loading === Loading.Fulfilled && evaluation_administration !== null && (
        <div className='flex flex-col gap-10'>
          <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
              <div>
                <Input
                  label='Evaluation name'
                  name='name'
                  placeholder='Evaluation name'
                  value={formData.name}
                  onChange={handleInputChange}
                  error={validationErrors.name}
                  maxLength={100}
                />
              </div>
              <div className='flex flex-col gap-4'>
                <div>
                  <DateRangePicker
                    name='evaluation_period'
                    label='Evaluation Period'
                    value={{
                      startDate: formData.eval_period_start_date ?? "",
                      endDate: formData.eval_period_end_date ?? "",
                    }}
                    onChange={(value) => handleChangeDateRange(value, "eval_period")}
                  />
                </div>
                <div>
                  <DateRangePicker
                    name='evaluation_schedule'
                    label='Evaluation Schedule'
                    value={{
                      startDate: formData.eval_schedule_start_date ?? "",
                      endDate: formData.eval_schedule_end_date ?? "",
                    }}
                    onChange={(value) => handleChangeDateRange(value, "eval_schedule")}
                  />
                </div>
              </div>
            </div>
            <TextArea
              label='Evaluation description/notes'
              name='remarks'
              placeholder='Some description'
              value={formData.remarks}
              onChange={handleTextAreaChange}
              error={validationErrors.remarks}
            />
          </div>
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
              name='email_content'
              placeholder='Some description'
              value={formData.email_content}
              onChange={handleTextAreaChange}
              error={validationErrors.email_content}
            />
          </div>
          <div>
            {error != null && <p className='text-red-500'>{error}</p>}
            <div className='flex justify-between'>
              <Button variant='primaryOutline' onClick={toggleDialog}>
                Cancel & Exit
              </Button>
              <Button onClick={handleSubmit}>
                {" "}
                {evaluation_results.length !== 0 ? "Save" : "Save and Proceed"}
              </Button>
            </div>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
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
            />
          </Suspense>
        </div>
      )}
    </>
  )
}
