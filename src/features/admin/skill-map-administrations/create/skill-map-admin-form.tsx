import { Suspense, lazy, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ValidationError } from "yup"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Button } from "@components/ui/button/button"
import { Input } from "@components/ui/input/input"
import { TextArea } from "@components/ui/textarea/text-area"
import { Loading } from "@custom-types/loadingType"
import { getByTemplateType } from "@redux/slices/email-template-slice"
import { type SkillMapAdminFormData } from "@custom-types/form-data-type"
import {
  createSkillMapAdmin,
  getSkillMapAdmin,
  updateSkillMapAdmin,
  setSelectedEmployeeIds,
} from "@redux/slices/skill-map-administration-slice"
import { setAlert } from "@redux/slices/app-slice"
import { DateRangePicker } from "@components/ui/date-range-picker/date-range-picker"
import { type DateValueType, type DateType } from "react-tailwindcss-datepicker"
import { createSkillMapAdminSchema } from "@utils/validation/skill-map-admin-schema"

const SkillMapAdminDialog = lazy(
  async () =>
    await import("@features/admin/skill-map-administrations/skill-map-administrations-dialog")
)

export const SkillMapAdminForm = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { id } = useParams()
  const { loading, skill_map_administration } = useAppSelector(
    (state) => state.skillMapAdministration
  )
  const { emailTemplate } = useAppSelector((state) => state.emailTemplate)

  const [formData, setFormData] = useState<SkillMapAdminFormData>({
    name: "",
    skill_map_period_start_date: "",
    skill_map_period_end_date: "",
    skill_map_schedule_start_date: "",
    skill_map_schedule_end_date: "",
    remarks: "",
    email_subject: "",
    email_content: "",
  })

  const [validationErrors, setValidationErrors] = useState<Partial<SkillMapAdminFormData>>({})
  const [showDialog, setShowDialog] = useState<boolean>(false)

  useEffect(() => {
    void appDispatch(getByTemplateType("Create Skill Map Admin"))
    if (id !== undefined) {
      void appDispatch(getSkillMapAdmin(parseInt(id)))
    }
  }, [])

  useEffect(() => {
    if (id !== undefined) {
      setFormData({
        name: skill_map_administration?.name,
        skill_map_period_start_date: skill_map_administration?.skill_map_period_start_date,
        skill_map_period_end_date: skill_map_administration?.skill_map_period_end_date,
        skill_map_schedule_start_date: skill_map_administration?.skill_map_schedule_start_date,
        skill_map_schedule_end_date: skill_map_administration?.skill_map_schedule_end_date,
        remarks: skill_map_administration?.remarks,
        email_subject: skill_map_administration?.email_subject,
        email_content: skill_map_administration?.email_content,
      })
    }
  }, [skill_map_administration])

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
      await createSkillMapAdminSchema.validate(formData, {
        abortEarly: false,
      })
      const result = await appDispatch(createSkillMapAdmin(formData))
      if (result.type === "skillMapAdministration/createSkillMapAdmin/fulfilled") {
        void appDispatch(setSelectedEmployeeIds([]))
        navigate(`/admin/skill-map-administrations/${result.payload.id}/select`)
      }
      if (result.type === "skillMapAdministration/createSkillMapAdmin/rejected") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<SkillMapAdminFormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof SkillMapAdminFormData] = err.message
        })
        setValidationErrors(errors)
      }
    }
  }

  const handleEdit = async () => {
    try {
      await createSkillMapAdminSchema.validate(formData, {
        abortEarly: false,
      })
      if (id !== undefined) {
        const result = await appDispatch(
          updateSkillMapAdmin({ id: parseInt(id), skillMapAdmin: formData })
        )
        if (result.type === "skillMapAdministration/updateSkillMapAdmin/fulfilled") {
          navigate(`/admin/skill-map-administrations/${result.payload.id}`)
        }
        if (result.type === "skillMapAdministration/updateSkillMapAdmin/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<SkillMapAdminFormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof SkillMapAdminFormData] = err.message
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

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }
  const handleRedirect = () => {
    if (id !== undefined) {
      navigate(`/admin/skill-map-administrations/${id}`)
    } else {
      navigate(`/admin/skill-map-administrations`)
    }
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
            value={formData.name ?? ""}
            onChange={handleInputChange}
            error={validationErrors.name}
            maxLength={100}
          />
        </div>
        <div className='flex flex-col'>
          <DateRangePicker
            name='skill_map_period'
            label='Skill Map Period'
            value={{
              startDate: formData.skill_map_period_start_date ?? "",
              endDate: formData.skill_map_period_end_date ?? "",
            }}
            onChange={(value) => handleChangeDateRange(value, "skill_map_period")}
            error={{
              start_date: validationErrors.skill_map_period_start_date,
              end_date: validationErrors.skill_map_period_end_date,
            }}
          />
        </div>
        <div className='flex flex-col'>
          <DateRangePicker
            name='skill_map_schedule'
            label='Skill Map Schedule'
            value={{
              startDate: formData.skill_map_schedule_start_date ?? "",
              endDate: formData.skill_map_schedule_end_date ?? "",
            }}
            onChange={(value) => handleChangeDateRange(value, "skill_map_schedule")}
            error={{
              start_date: validationErrors.skill_map_schedule_start_date,
              end_date: validationErrors.skill_map_schedule_end_date,
            }}
            dateLimit={{ start_date: dateLimit(formData.skill_map_period_end_date) }}
          />
        </div>
      </div>
      <TextArea
        label='Description'
        name='remarks'
        placeholder='Some description'
        value={formData.remarks ?? ""}
        onChange={handleTextAreaChange}
        error={validationErrors.remarks}
      />
      <div className='flex flex-col gap-4'>
        <h1 className='text-lg font-bold'>Email</h1>
        <Input
          label='Subject'
          name='email_subject'
          placeholder='Subject'
          value={formData.email_subject ?? ""}
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
          <Button
            onClick={async () => (id === undefined ? await handleSubmit() : await handleEdit())}
            loading={loading === Loading.Pending}
          >
            {id === undefined ? "Save & Proceed" : "Save"}
          </Button>
        </div>
      </div>
      <Suspense>
        <SkillMapAdminDialog
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
