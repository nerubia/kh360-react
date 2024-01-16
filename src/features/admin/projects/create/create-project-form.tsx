import { useEffect, useState } from "react"
import { useNavigate, useSearchParams, useParams } from "react-router-dom"
import { ValidationError } from "yup"
import { type SingleValue } from "react-select"
import { Input } from "../../../../components/ui/input/input"
import { TextArea } from "../../../../components/ui/textarea/text-area"
import { Button, LinkButton } from "../../../../components/ui/button/button"
import Dialog from "../../../../components/ui/dialog/dialog"
import { CustomSelect } from "../../../../components/ui/select/custom-select"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { type ProjectFormData } from "../../../../types/form-data-type"
import { type Option } from "../../../../types/optionType"
import { getActiveClients } from "../../../../redux/slices/clients-slice"
import { setAlert } from "../../../../redux/slices/app-slice"
import { createProjectSchema } from "../../../../utils/validation/project-schema"
import { ProjectStatus } from "../../../../types/project-type"
import { CreateProjectTable } from "../../../../features/admin/projects/create/create-project-table"
import { setProjectFormData, createProject } from "../../../../redux/slices/project-slice"
import { setSelectedSkills, setCheckedSkills } from "../../../../redux/slices/skills-slice"

export const CreateProjectForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const callback = searchParams.get("callback")

  const appDispatch = useAppDispatch()
  const { project, projectFormData } = useAppSelector((state) => state.project)
  const { selectedSkills } = useAppSelector((state) => state.skills)
  const { clients } = useAppSelector((state) => state.clients)

  const [validationErrors, setValidationErrors] = useState<Partial<ProjectFormData>>({})
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false)
  const [clientOptions, setClientOptions] = useState<Option[]>([])
  const statusOptions: Option[] = Object.values(ProjectStatus).map((value) => ({
    label: value,
    value,
  }))

  useEffect(() => {
    void appDispatch(getActiveClients())
  }, [])

  useEffect(() => {
    if (id !== undefined && project !== null) {
      void appDispatch(
        setProjectFormData({
          name: project.name,
          client_id: project.client?.id.toString(),
          start_date: project.start_date,
          end_date: project.end_date,
          description: project.description,
          status: project.status,
          skill_ids: [],
        })
      )
    }
  }, [project])

  useEffect(() => {
    const options: Option[] = clients.map((client) => ({
      label: client.display_name ?? "",
      value: client.id.toString(),
    }))
    setClientOptions(options)
  }, [clients])

  const onChangeClient = async (option: SingleValue<Option>) => {
    const client: string = option !== null ? option.value : ""
    void appDispatch(setProjectFormData({ ...projectFormData, client_id: client }))
  }

  const onChangeStatus = async (option: SingleValue<Option>) => {
    const status: string = option !== null ? option.value : ""
    void appDispatch(setProjectFormData({ ...projectFormData, status }))
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    void appDispatch(setProjectFormData({ ...projectFormData, [name]: value }))
  }

  const handleTextAreaChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        navigate(callback ?? `/admin/projects/${result.payload.id}`)
        appDispatch(
          setAlert({
            description: "Added new project",
            variant: "success",
          })
        )
        void appDispatch(
          setProjectFormData({
            name: "",
            client_id: "",
            start_date: "",
            end_date: "",
            description: "",
            status: "",
            skill_ids: [],
          })
        )
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

  const handleUpdate = async () => {}

  const handleCancel = () => {
    void appDispatch(setProjectFormData({}))
    void appDispatch(setSelectedSkills([]))
    void appDispatch(setCheckedSkills([]))
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-4'>
        <div>
          <h2 className='font-medium'>Name</h2>
          <Input
            name='name'
            placeholder='Name'
            value={projectFormData.name}
            onChange={handleInputChange}
            error={validationErrors.name}
          />
        </div>
        <div className='flex flex-wrap gap-4'>
          <div className='flex-1'>
            <CustomSelect
              data-test-id='SelectClient'
              label='Client'
              name='client_id'
              value={clientOptions.find((option) => option.value === projectFormData.client_id)}
              onChange={async (option) => await onChangeClient(option)}
              options={clientOptions}
              fullWidth
              error={validationErrors.client_id}
            />
          </div>
        </div>
        <div className='flex flex-col'>
          <h2 className='font-medium'>Project Duration</h2>
          <div className='flex flex-col sm:flex-row items-center gap-4'>
            <div className='w-full'>
              <Input
                name='start_date'
                type='date'
                placeholder='Start date'
                value={projectFormData.start_date}
                onChange={handleInputChange}
                error={validationErrors.start_date}
                max={projectFormData.end_date}
              />
            </div>
            <h2 className='font-medium'>to</h2>
            <div className='w-full'>
              <Input
                name='end_date'
                type='date'
                placeholder='End date'
                value={projectFormData.end_date}
                onChange={handleInputChange}
                error={validationErrors.end_date}
                min={projectFormData.start_date}
              />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <TextArea
            label='Description'
            name='description'
            placeholder='Description'
            value={projectFormData.description}
            onChange={handleTextAreaChange}
            error={validationErrors.description}
          />
        </div>
        <CustomSelect
          data-test-id='SelectProjectStatus'
          label='Status'
          name='project_status'
          value={statusOptions.find((option) => option.value === projectFormData.status)}
          onChange={async (option) => await onChangeStatus(option)}
          options={statusOptions}
          fullWidth
          error={validationErrors.status}
        />
      </div>
      <CreateProjectTable />
      <div className='flex justify-between'>
        <Button variant='primaryOutline' onClick={toggleCancelDialog}>
          Cancel
        </Button>
        <Button onClick={toggleSaveDialog}>Save</Button>
      </div>
      <Dialog open={showSaveDialog}>
        <Dialog.Title>Save Project</Dialog.Title>
        <Dialog.Description>Are you sure you want to save this project?</Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={toggleSaveDialog}>
            No
          </Button>
          <Button
            variant='primary'
            onClick={async () => {
              await toggleSaveDialog()
              project === null ? await handleSubmit() : await handleUpdate()
            }}
          >
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
      <Dialog open={showCancelDialog}>
        <Dialog.Title>Cancel</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to cancel? <br />
          If you cancel, your data won&apos;t be saved.
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={toggleCancelDialog}>
            No
          </Button>
          <LinkButton variant='primary' to={callback ?? "/admin/projects"} onClick={handleCancel}>
            Yes
          </LinkButton>
        </Dialog.Actions>
      </Dialog>
    </div>
  )
}
