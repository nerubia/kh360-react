import { useEffect, useState, lazy, Suspense } from "react"
import { useNavigate, useSearchParams, useParams } from "react-router-dom"
import { ValidationError } from "yup"
import { type SingleValue } from "react-select"
import { Input } from "@components/ui/input/input"
import { TextArea } from "@components/ui/textarea/text-area"
import { Button } from "@components/ui/button/button"
import { CustomSelect } from "@components/ui/select/custom-select"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { type ProjectFormData } from "@custom-types/form-data-type"
import { type Option } from "@custom-types/optionType"
import { getActiveClients } from "@redux/slices/clients-slice"
import { setAlert } from "@redux/slices/app-slice"
import { createProjectSchema } from "@utils/validation/project-schema"
import { ProjectStatus } from "@custom-types/project-type"
import { CreateProjectTable } from "@features/admin/projects/create/create-project-table"
import {
  setProjectFormData,
  createProject,
  getProject,
  setProject,
  updateProject,
} from "@redux/slices/project-slice"
import { setSelectedSkills, setCheckedSkills } from "@redux/slices/skills-slice"
import useSmoothScrollToTop from "@hooks/use-smooth-scroll-to-top"
import { DateRangePicker } from "@components/ui/date-range-picker/date-range-picker"
import { type DateValueType } from "react-tailwindcss-datepicker"

export const CreateProjectForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const callback = searchParams.get("callback")
  const hasEdited = searchParams.get("hasEdited")
  const scrollToTop = useSmoothScrollToTop()

  const appDispatch = useAppDispatch()
  const { project, projectFormData } = useAppSelector((state) => state.project)
  const { selectedSkills } = useAppSelector((state) => state.skills)
  const { clients } = useAppSelector((state) => state.clients)
  const { previousUrl } = useAppSelector((state) => state.app)

  const [validationErrors, setValidationErrors] = useState<Partial<ProjectFormData>>({})
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false)
  const [clientOptions, setClientOptions] = useState<Option[]>([])
  const statusOptions: Option[] = Object.values(ProjectStatus).map((value) => ({
    label: value,
    value,
  }))

  const ProjectsDialog = lazy(async () => await import("@features/admin/projects/projects-dialog"))

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getProject(parseInt(id)))
    }
    if (hasEdited === null) {
      void appDispatch(setProjectFormData(null))
    }
    void appDispatch(getActiveClients())
    scrollToTop()
  }, [])

  useEffect(() => {
    const options: Option[] = clients.map((client) => ({
      label: client.display_name ?? "",
      value: client.id.toString(),
    }))
    setClientOptions(options)
  }, [clients])

  useEffect(() => {
    if (id !== undefined && project !== null) {
      if (projectFormData === null) {
        void appDispatch(
          setProjectFormData({
            name: project.name,
            client_id: project.client?.id.toString(),
            start_date: project.start_date?.split("T")[0],
            end_date: project.end_date?.split("T")[0],
            description: project.description ?? "",
            status: project.status,
            skill_ids: [],
          })
        )
      }
      if (selectedSkills.length === 0) {
        const skillsCopy = [...(project.project_skills ?? [])]
        const sortedSkills = skillsCopy?.sort((a, b) => {
          return (a.sequence_no ?? 0) - (b.sequence_no ?? 0)
        })
        void appDispatch(setSelectedSkills(sortedSkills))
        void appDispatch(setCheckedSkills(sortedSkills))
      }
    }
  }, [project])

  const onChangeClient = async (option: SingleValue<Option>) => {
    setValidationErrors({})
    const client: string | undefined = option?.value
    void appDispatch(setProjectFormData({ ...projectFormData, client_id: client }))
  }

  const onChangeStatus = async (option: SingleValue<Option>) => {
    setValidationErrors({})
    const status: string = option !== null ? option.value : ""
    void appDispatch(setProjectFormData({ ...projectFormData, status }))
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationErrors({})
    const { name, value } = e.target
    void appDispatch(setProjectFormData({ ...projectFormData, [name]: value }))
  }

  const handleTextAreaChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValidationErrors({})
    const { name, value } = e.target
    void appDispatch(setProjectFormData({ ...projectFormData, [name]: value }))
  }

  const toggleSaveDialog = async () => {
    setShowSaveDialog((prev) => !prev)
  }

  const toggleCancelDialog = async () => {
    setShowCancelDialog((prev) => !prev)
  }

  const handleSubmit = async () => {
    try {
      const skill_ids = selectedSkills.map((skill) => skill.id.toString())
      const updatedFormData = appDispatch(setProjectFormData({ ...projectFormData, skill_ids }))
      await createProjectSchema.validate(updatedFormData.payload, {
        abortEarly: false,
      })

      const result = await appDispatch(createProject(updatedFormData.payload))
      if (result.type === "project/createProject/rejected") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      }
      if (result.type === "project/createProject/fulfilled") {
        navigate(callback ?? previousUrl ?? `/admin/projects/${result.payload.id}`)
        appDispatch(
          setAlert({
            description: "Added new project",
            variant: "success",
          })
        )
        void appDispatch(setProjectFormData(null))
        void appDispatch(setProject(null))
        void appDispatch(setSelectedSkills([]))
        void appDispatch(setCheckedSkills([]))
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<ProjectFormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof ProjectFormData] = err.message
        })
        setValidationErrors(errors)
      }
    }
  }

  const handleUpdate = async () => {
    if (id !== undefined) {
      try {
        const skill_ids = selectedSkills.map((skill) => skill.id)
        const updatedFormData = appDispatch(setProjectFormData({ ...projectFormData, skill_ids }))
        await createProjectSchema.validate(updatedFormData.payload, {
          abortEarly: false,
        })
        const result = await appDispatch(
          updateProject({
            id: parseInt(id),
            project: updatedFormData.payload,
          })
        )
        if (result.type === "project/updateProject/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
        if (result.type === "project/updateProject/fulfilled") {
          navigate(callback ?? previousUrl ?? `/admin/projects/${result.payload.id}`)
          appDispatch(
            setAlert({
              description: "Successfully updated project",
              variant: "success",
            })
          )
          void appDispatch(setProjectFormData(null))
          void appDispatch(setProject(null))
          void appDispatch(setSelectedSkills([]))
          void appDispatch(setCheckedSkills([]))
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          const errors: Partial<ProjectFormData> = {}
          error.inner.forEach((err) => {
            errors[err.path as keyof ProjectFormData] = err.message
          })
          setValidationErrors(errors)
        }
      }
    }
  }

  const handleCancel = () => {
    void appDispatch(setProjectFormData(null))
    void appDispatch(setProject(null))
    void appDispatch(setSelectedSkills([]))
    void appDispatch(setCheckedSkills([]))
    navigate(callback ?? previousUrl ?? `/admin/projects/${id}`)
  }

  return (
    <>
      {((projectFormData !== null && project !== null) || project === null) && (
        <>
          <div className='flex flex-col gap-10 md:w-1/2'>
            <div className='flex flex-col gap-4'>
              <div>
                <h2 className='font-medium'>Name</h2>
                <Input
                  name='name'
                  placeholder='Name'
                  value={projectFormData?.name ?? ""}
                  onChange={handleInputChange}
                  error={validationErrors.name}
                  maxLength={255}
                />
              </div>
              <div className='flex flex-wrap gap-4'>
                <div className='flex-1'>
                  <CustomSelect
                    data-test-id='SelectClient'
                    label='Client'
                    name='client_id'
                    value={clientOptions.find(
                      (option) => option.value === projectFormData?.client_id
                    )}
                    onChange={async (option) => await onChangeClient(option)}
                    options={clientOptions}
                    fullWidth
                    error={validationErrors.client_id}
                    isClearable={true}
                  />
                </div>
              </div>
              <div className='flex flex-col'>
                <DateRangePicker
                  name='project-duration'
                  label='Project Duration'
                  autoScoll
                  value={{
                    startDate: projectFormData?.start_date ?? "",
                    endDate: projectFormData?.end_date ?? "",
                  }}
                  onChange={(value: DateValueType) => {
                    void appDispatch(
                      setProjectFormData({
                        ...projectFormData,
                        start_date: value?.startDate?.toString().split("T")[0] ?? "",
                        end_date: value?.endDate?.toString().split("T")[0] ?? "",
                      })
                    )
                  }}
                />
              </div>
              <div className='flex flex-col gap-4'>
                <TextArea
                  label='Description'
                  name='description'
                  placeholder='Description'
                  value={projectFormData?.description ?? ""}
                  onChange={handleTextAreaChange}
                  error={validationErrors.description}
                />
              </div>
              <CustomSelect
                data-test-id='SelectProjectStatus'
                label='Status'
                name='project_status'
                value={statusOptions.find((option) => option.value === projectFormData?.status)}
                onChange={async (option) => await onChangeStatus(option)}
                options={statusOptions}
                fullWidth={false}
                error={validationErrors.status}
              />
            </div>
          </div>
          <CreateProjectTable />
          <div className='flex justify-between xl:w-2/3 pr-5'>
            <Button variant='primaryOutline' onClick={toggleCancelDialog}>
              Cancel
            </Button>
            <Button onClick={toggleSaveDialog}>Save</Button>
          </div>

          <Suspense>
            <ProjectsDialog
              open={showSaveDialog}
              title='Save Project'
              description='Are you sure you want to save this project?'
              onClose={toggleSaveDialog}
              onSubmit={async () => {
                await toggleSaveDialog()
                project === null ? await handleSubmit() : await handleUpdate()
              }}
            />
          </Suspense>
          <Suspense>
            <ProjectsDialog
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
          </Suspense>
        </>
      )}
    </>
  )
}
