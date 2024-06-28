import { Suspense, lazy, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ValidationError } from "yup"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Button } from "@components/ui/button/button"
import { Input } from "@components/ui/input/input"
import { TextArea } from "@components/ui/textarea/text-area"
import { Loading } from "@custom-types/loadingType"
import { type SkillMapAdminFormData } from "@custom-types/form-data-type"
import {
  getSkillMapAdmin,
  updateSkillMapAdmin,
  setSelectedEmployeeIds,
  uploadSkillMapAdmin,
} from "@redux/slices/skill-map-administration-slice"
import { setAlert, setMultipleAlerts } from "@redux/slices/app-slice"
import { DateRangePicker } from "@components/ui/date-range-picker/date-range-picker"
import { type DateValueType, type DateType } from "react-tailwindcss-datepicker"
import { uploadSkillMapAdminSchema } from "@utils/validation/skill-map-admin-schema"
import { setSkillMapResults } from "@redux/slices/skill-map-results-slice"
import { SkillMapAdminStatus } from "@custom-types/skill-map-admin-type"

const SkillMapAdminDialog = lazy(
  async () =>
    await import("@features/admin/skill-map-administrations/skill-map-administrations-dialog")
)

const maxSize = 5 * 1024 * 1024 // 5MB in bytes

export const UploadSkillMapAdminForm = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { id } = useParams()
  const { loading, skill_map_administration } = useAppSelector(
    (state) => state.skillMapAdministration
  )

  const [formData, setFormData] = useState<SkillMapAdminFormData>({
    name: "",
    skill_map_period_start_date: "",
    skill_map_period_end_date: "",
    skill_map_schedule_start_date: "",
    skill_map_schedule_end_date: "",
    remarks: "",
    file: "",
  })

  const [validationErrors, setValidationErrors] = useState<Partial<SkillMapAdminFormData>>({})
  const [showDialog, setShowDialog] = useState<boolean>(false)

  useEffect(() => {
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
      })
    }
  }, [skill_map_administration])

  const handleSubmit = async () => {
    try {
      await uploadSkillMapAdminSchema.validate(formData, {
        abortEarly: false,
      })
      const result = await appDispatch(uploadSkillMapAdmin(formData))
      appDispatch(setMultipleAlerts(true))

      if (result.type === "skillMapAdministration/uploadSkillMapAdmin/fulfilled") {
        void appDispatch(setSelectedEmployeeIds([]))
        appDispatch(setSkillMapResults([]))

        appDispatch(
          setAlert({
            description: [
              "Successfully added data for following users:",
              ...result.payload.successList.map((user: string) => `- ${user}`),
            ],
            variant: "success",
          })
        )
        const filteredErrorList = result.payload.errorList.filter(
          (user: string) => user.trim() !== ""
        )

        if (filteredErrorList.length > 0) {
          appDispatch(
            setAlert({
              description: [
                "Error adding data for following users:",
                ...result.payload.errorList.map((user: string) => `- ${user}`),
              ],
              variant: "destructive",
            })
          )
        }

        navigate(`/admin/skill-map-administrations/${result.payload.data.id}`)
      }

      if (result.type === "skillMapAdministration/uploadSkillMapAdmin/rejected") {
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

  // TODO: edit ?
  const handleEdit = async () => {
    try {
      await uploadSkillMapAdminSchema.validate(formData, {
        abortEarly: false,
      })
      if (id !== undefined) {
        const result = await appDispatch(
          updateSkillMapAdmin({ id: parseInt(id), skillMapAdmin: formData })
        )
        if (result.type === "skillMapAdministration/updateSkillMapAdmin/fulfilled") {
          if (skill_map_administration?.status === SkillMapAdminStatus.Draft) {
            navigate(`/admin/skill-map-administrations/${result.payload.id}/select`)
          } else {
            navigate(`/admin/skill-map-administrations/${result.payload.id}`)
          }
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

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.size > maxSize) {
        setValidationErrors((prev) => ({ ...prev, file: "File size exceeds the limit of 5MB" }))
        return
      }
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        setFormData({ ...formData, file: fileReader.result as string })
      }
    }
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
      <div className='flex flex-col'>
        <Input
          type='file'
          name='file'
          placeholder='File'
          onChange={handleSelectFile}
          error={validationErrors.file}
          accept='.csv'
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
            {id === undefined || skill_map_administration?.status === SkillMapAdminStatus.Draft
              ? "Save & Proceed"
              : "Save"}
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
