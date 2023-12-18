import { useEffect, useState } from "react"
import { debounce } from "lodash"
import { Button, LinkButton } from "../../../../components/ui/button/button"
import { CustomSelect } from "../../../../components/ui/select/custom-select"
import Dialog from "../../../../components/ui/dialog/dialog"
import { Input } from "../../../../components/ui/input/input"
import { type Option } from "../../../../types/optionType"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { getUsers } from "../../../../redux/slices/users-slice"
import { getProjects } from "../../../../redux/slices/projects-slice"
import { getProjectRoles } from "../../../../redux/slices/project-roles-slice"
import { type ProjectMemberFormData } from "../../../../types/form-data-type"
import {
  createProjectMember,
  searchProjectMembers,
} from "../../../../redux/slices/project-members-slice"
import { useNavigate } from "react-router-dom"
import { ValidationError } from "yup"
import { createProjectMemberSchema } from "../../../../utils/validation/project-member-schema"
import { formatDateRange } from "../../../../utils/format-date"

export const ProjectAssignmentForm = () => {
  const navigate = useNavigate()

  const appDispatch = useAppDispatch()
  const { users } = useAppSelector((state) => state.users)
  const { project_roles } = useAppSelector((state) => state.projectRoles)
  const { projects } = useAppSelector((state) => state.projects)
  const { project_members } = useAppSelector((state) => state.projectMembers)

  const [activeUsers, setActiveUsers] = useState<Option[]>([])
  const [activeProjects, setActiveProjects] = useState<Option[]>([])
  const [activeProjectRoles, setActiveProjectRoles] = useState<Option[]>([])

  const [formData, setFormData] = useState<ProjectMemberFormData>({
    project_id: "",
    user_id: "",
    project_role_id: "",
    start_date: "",
    end_date: "",
    allocation_rate: "",
    remarks: "",
  })

  const [validationErrors, setValidationErrors] = useState<Partial<ProjectMemberFormData>>({})

  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [showOverlapDialog, setShowOverlapDialog] = useState<boolean>(false)

  useEffect(() => {
    void appDispatch(getProjectRoles())
  }, [])

  useEffect(() => {
    const options: Option[] = users.map((user) => ({
      label: `${user.last_name}, ${user.first_name}`,
      value: user.id.toString(),
    }))
    setActiveUsers(options)
  }, [users])

  useEffect(() => {
    const options: Option[] = projects.map((project) => ({
      label: `${project?.name}`,
      value: project.id.toString(),
    }))
    setActiveProjects(options)
  }, [projects])

  useEffect(() => {
    const options: Option[] = project_roles.map((projectRole) => ({
      label: `${projectRole?.name}`,
      value: projectRole.id.toString(),
    }))
    setActiveProjectRoles(options)
  }, [project_roles])

  useEffect(() => {
    if (
      formData.user_id?.length !== 0 &&
      formData.start_date?.length !== 0 &&
      formData.end_date?.length !== 0
    ) {
      void appDispatch(
        searchProjectMembers({
          start_date: formData.start_date,
          end_date: formData.end_date,
          user_id: parseInt(formData.user_id as string),
          overlap: 1,
        })
      )
    }
  }, [formData.user_id, formData.start_date, formData.end_date])

  const toggleDialog = async () => {
    setShowDialog((prev) => !prev)
  }

  const toggleOverlapDialog = async () => {
    setShowOverlapDialog((prev) => !prev)
  }

  const handleSearchUser = (value: string) => {
    if (value.length !== 0) {
      void appDispatch(
        getUsers({
          name: value,
        })
      )
    }
  }

  const handleSearchProject = (value: string) => {
    if (value.length !== 0) {
      void appDispatch(
        getProjects({
          name: value,
        })
      )
    }
  }

  const debouncedSearchUser = debounce(handleSearchUser, 500)
  const debouncedSearchProject = debounce(handleSearchProject, 500)

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const checkOverlap = async () => {
    try {
      await createProjectMemberSchema.validate(formData, {
        abortEarly: false,
      })
      if (project_members.length > 0) {
        setShowOverlapDialog(true)
        return
      }
      void handleSubmit()
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<ProjectMemberFormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof ProjectMemberFormData] = err.message
        })
        setValidationErrors(errors)
      }
    }
  }

  const handleSubmit = async () => {
    try {
      const result = await appDispatch(createProjectMember(formData))
      if (result.payload.id !== undefined) {
        navigate(`/admin/project-assignments`)
      }
    } catch (error) {}
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col md:w-1/2 gap-4'>
        <CustomSelect
          data-test-id='EmployeeName'
          label='Employee Name'
          name='employee_name'
          value={activeUsers.find((option) => option.value === formData.user_id)}
          onChange={(option) => {
            if (option?.value !== undefined) {
              setFormData({
                ...formData,
                user_id: option.value,
              })
            }
          }}
          onInputChange={(value) => debouncedSearchUser(value)}
          options={activeUsers}
          fullWidth
          error={validationErrors.user_id}
        />
        <CustomSelect
          data-test-id='Project'
          label='Project'
          name='project'
          value={activeProjects.find((option) => option.value === formData.project_id)}
          onChange={(option) => {
            if (option?.value !== undefined) {
              setFormData({
                ...formData,
                project_id: option.value,
              })
            }
          }}
          onInputChange={(value) => debouncedSearchProject(value)}
          options={activeProjects}
          fullWidth
          error={validationErrors.project_id}
        />
        <CustomSelect
          data-test-id='ProjectRole'
          label='Role'
          name='role'
          value={activeProjectRoles.find((option) => option.value === formData.project_role_id)}
          onChange={(option) => {
            if (option?.value !== undefined) {
              setFormData({
                ...formData,
                project_role_id: option.value,
              })
            }
          }}
          options={activeProjectRoles}
          fullWidth
          error={validationErrors.project_role_id}
        />
        <div className='flex flex-col'>
          <h2 className='font-medium'>Assignment Duration</h2>
          <div className='flex flex-col sm:flex-row items-center gap-4'>
            <div className='w-full'>
              <Input
                name='start_date'
                type='date'
                placeholder='Start date'
                value={formData.start_date}
                onChange={handleInputChange}
                error={validationErrors.start_date}
              />
            </div>
            <h2 className='font-medium'>to</h2>
            <div className='w-full'>
              <Input
                name='end_date'
                type='date'
                placeholder='End date'
                value={formData.end_date}
                onChange={handleInputChange}
                error={validationErrors.end_date}
                min={formData.start_date}
              />
            </div>
          </div>
        </div>
        <Input
          label='Allocation rate'
          name='allocation_rate'
          type='number'
          placeholder='Allocation rate'
          value={formData.allocation_rate}
          onChange={handleInputChange}
          error={validationErrors.allocation_rate}
          max={100}
        />
      </div>
      <div className='flex justify-between md:w-1/2'>
        <Button variant='primaryOutline' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button onClick={checkOverlap}>Add</Button>
      </div>
      <Dialog open={showDialog}>
        <Dialog.Title>Cancel</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to cancel? <br />
          If you cancel, your data won&apos;t be saved.
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={toggleDialog}>
            No
          </Button>
          <LinkButton variant='primary' to='/admin/project-assignments'>
            Yes
          </LinkButton>
        </Dialog.Actions>
      </Dialog>
      <Dialog open={showOverlapDialog}>
        <Dialog.Title>Warning</Dialog.Title>
        <Dialog.Description>
          Hey there!
          <br />
          <br />
          We&apos;ve detected a potential overlap in project assignments based on the information
          you&apos;re adding. Before we proceed, we want to ensure you&apos;re aware of this and
          give you the option to reconsider.
          <br />
          <br />
          Overlapping Projects:
          <br />
          <br />
          {project_members.map((projectMember) => (
            <div key={projectMember.id}>
              <h2 className='font-bold'>{projectMember.project?.name}</h2>
              <p>
                Evaluation Period:{" "}
                {formatDateRange(projectMember.start_date, projectMember.end_date)}
              </p>
              <p>Allocation Rate: {projectMember.allocation_rate}%</p>
              <br />
            </div>
          ))}
          Please click CONTINUE if you&apos;re confident this overlap is intentional or has been
          coordinated. Otherwise, click CANCEL to review and make adjustments.
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={toggleOverlapDialog}>
            Cancel
          </Button>
          <Button variant='primary' onClick={handleSubmit}>
            Continue
          </Button>
        </Dialog.Actions>
      </Dialog>
    </div>
  )
}
