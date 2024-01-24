import { useEffect, useState } from "react"
import { debounce } from "lodash"
import { Button } from "../../../../components/ui/button/button"
import { CustomSelect } from "../../../../components/ui/select/custom-select"
import Dialog from "../../../../components/ui/dialog/dialog"
import { Input } from "../../../../components/ui/input/input"
import { type Option } from "../../../../types/optionType"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { getUsers } from "../../../../redux/slices/users-slice"
import { getAllProjects } from "../../../../redux/slices/projects-slice"
import { getProjectRoles } from "../../../../redux/slices/project-roles-slice"
import { type ProjectMemberFormData } from "../../../../types/form-data-type"
import {
  createProjectMember,
  searchProjectMembers,
} from "../../../../redux/slices/project-members-slice"
import { useNavigate, useParams } from "react-router-dom"
import { ValidationError } from "yup"
import { createProjectMemberSchema } from "../../../../utils/validation/project-member-schema"
import { formatDateRange } from "../../../../utils/format-date"
import {
  getProjectMember,
  setProjectMember,
  updateProjectMember,
  setProjectMemberFormData,
} from "../../../../redux/slices/project-member-slice"
import { Spinner } from "../../../../components/ui/spinner/spinner"
import { Loading } from "../../../../types/loadingType"
import { EditProjectAssignmentTable } from "../[id]/edit/edit-project-assignment-table"
import { setSelectedSkills, setCheckedSkills } from "../../../../redux/slices/skills-slice"
import { getProject } from "../../../../redux/slices/project-slice"
import { setAlert } from "../../../../redux/slices/app-slice"
import { setProjectSkills } from "../../../../redux/slices/project-skills-slice"

export const ProjectAssignmentForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const appDispatch = useAppDispatch()
  const { users } = useAppSelector((state) => state.users)
  const { project_roles } = useAppSelector((state) => state.projectRoles)
  const { projects } = useAppSelector((state) => state.projects)
  const { project_members } = useAppSelector((state) => state.projectMembers)
  const { loading, project_member, projectMemberFormData } = useAppSelector(
    (state) => state.projectMember
  )
  const { selectedSkills } = useAppSelector((state) => state.skills)

  const [activeUsers, setActiveUsers] = useState<Option[]>([])
  const [activeProjects, setActiveProjects] = useState<Option[]>([])
  const [activeProjectRoles, setActiveProjectRoles] = useState<Option[]>([])

  const [validationErrors, setValidationErrors] = useState<Partial<ProjectMemberFormData>>({})

  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false)
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)
  const [showOverlapDialog, setShowOverlapDialog] = useState<boolean>(false)

  useEffect(() => {
    void appDispatch(getProjectRoles())
    void appDispatch(setProjectSkills([]))
    if (id !== undefined) {
      void appDispatch(getProjectMember(parseInt(id)))
    }
  }, [])

  useEffect(() => {
    if (project_member !== null) {
      handleSearchUser(project_member.user?.last_name ?? "")
      handleSearchProject(project_member.project?.name ?? "")
      void appDispatch(
        setProjectMemberFormData({
          project_id: project_member.project_id?.toString(),
          user_id: project_member.user_id?.toString(),
          project_role_id: project_member.project_role_id?.toString(),
          start_date: project_member.start_date?.split("T")[0],
          end_date: project_member.end_date?.split("T")[0],
          allocation_rate: project_member.allocation_rate?.toString(),
          remarks: project_member.remarks,
        })
      )
      if (project_member.project_id !== undefined) {
        void appDispatch(getProject(project_member.project_id))
      }
      if (selectedSkills.length === 0) {
        const skillsCopy = [...(project_member.project_member_skills ?? [])]
        const sortedSkills = skillsCopy?.sort((a, b) => {
          return (a.sequence_no ?? 0) - (b.sequence_no ?? 0)
        })
        const sortedSelectedSkills = sortedSkills.map((skill) => skill.skills)
        void appDispatch(setSelectedSkills(sortedSelectedSkills))
        void appDispatch(setCheckedSkills(sortedSelectedSkills))
      }
    }
  }, [project_member])

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
      projectMemberFormData?.user_id?.length !== 0 &&
      projectMemberFormData?.start_date?.length !== 0 &&
      projectMemberFormData?.end_date?.length !== 0
    ) {
      void appDispatch(
        searchProjectMembers({
          start_date: projectMemberFormData?.start_date,
          end_date: projectMemberFormData?.end_date,
          user_id: parseInt(projectMemberFormData?.user_id as string),
          overlap: 1,
        })
      )
    }
  }, [
    projectMemberFormData?.user_id,
    projectMemberFormData?.start_date,
    projectMemberFormData?.end_date,
  ])

  const toggleSaveDialog = async () => {
    setShowSaveDialog((prev) => !prev)
  }

  const toggleCancelDialog = async () => {
    setShowCancelDialog((prev) => !prev)
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
        getAllProjects({
          name: value,
        })
      )
    }
  }

  const debouncedSearchUser = debounce(handleSearchUser, 500)
  const debouncedSearchProject = debounce(handleSearchProject, 500)

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    void appDispatch(setProjectMemberFormData({ ...projectMemberFormData, [name]: value }))
  }

  const checkOverlap = async () => {
    try {
      await toggleSaveDialog()
      await createProjectMemberSchema.validate(projectMemberFormData, {
        abortEarly: false,
      })
      const existingProjectMemberIds = project_members.map((member) => member.id)
      if (
        project_members.length > 0 &&
        !existingProjectMemberIds.includes(project_member?.id ?? 0)
      ) {
        setShowOverlapDialog(true)
        return
      }
      if (project_member === null) {
        void handleSubmit()
      } else {
        void handleEdit()
      }
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
      if (projectMemberFormData !== null) {
        await toggleSaveDialog()
        const skill_ids = selectedSkills.map((skill) => skill.id)
        const result = await appDispatch(
          createProjectMember({ ...projectMemberFormData, skill_ids })
        )
        if (result.type === "projectMember/createProjectMember/fulfilled") {
          appDispatch(
            setAlert({
              description: "Project assignment has been added successfully.",
              variant: "success",
            })
          )
          navigate(`/admin/project-assignments`)
        }
        if (result.type === "projectMember/createProjectMember/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
      }
    } catch (error) {}
  }

  const handleEdit = async () => {
    try {
      await toggleSaveDialog()
      if (id !== undefined) {
        const skill_ids = selectedSkills.map((skill) => skill.id)
        const result = await appDispatch(
          updateProjectMember({
            project_member: { ...projectMemberFormData, skill_ids },
            id: parseInt(id),
          })
        )
        if (result.type === "projectMember/updateProjectMember/fulfilled") {
          appDispatch(
            setAlert({
              description: "Project assignment has been updated successfully.",
              variant: "success",
            })
          )
          navigate(`/admin/project-assignments`)
        }
        if (result.type === "projectMember/updateProjectMember/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
      }
    } catch (error) {}
  }

  const handleCancel = () => {
    void appDispatch(setProjectMember(null))
    void appDispatch(setSelectedSkills([]))
    void appDispatch(setCheckedSkills([]))
    navigate("/admin/project-assignments")
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col md:w-1/2 gap-4'>
        {loading === Loading.Pending ? (
          <Spinner />
        ) : (
          <>
            <CustomSelect
              data-test-id='EmployeeName'
              label='Employee Name'
              name='employee_name'
              value={activeUsers.find((option) => option.value === projectMemberFormData?.user_id)}
              onChange={(option) => {
                if (option?.value !== undefined) {
                  void appDispatch(
                    setProjectMemberFormData({
                      ...projectMemberFormData,
                      user_id: option.value,
                    })
                  )
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
              value={activeProjects.find(
                (option) => option.value === projectMemberFormData?.project_id
              )}
              onChange={(option) => {
                if (option?.value !== undefined) {
                  void appDispatch(
                    setProjectMemberFormData({
                      ...projectMemberFormData,
                      project_id: option.value,
                    })
                  )
                  void appDispatch(getProject(parseInt(option.value)))
                  void appDispatch(setSelectedSkills([]))
                  void appDispatch(setCheckedSkills([]))
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
              value={activeProjectRoles.find(
                (option) => option.value === projectMemberFormData?.project_role_id
              )}
              onChange={(option) => {
                if (option?.value !== undefined) {
                  void appDispatch(
                    setProjectMemberFormData({
                      ...projectMemberFormData,
                      project_role_id: option.value,
                    })
                  )
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
                    value={projectMemberFormData?.start_date}
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
                    value={projectMemberFormData?.end_date}
                    onChange={handleInputChange}
                    error={validationErrors.end_date}
                    min={projectMemberFormData?.start_date}
                  />
                </div>
              </div>
            </div>
            <Input
              label='Allocation rate'
              name='allocation_rate'
              type='number'
              placeholder='Allocation rate'
              value={projectMemberFormData?.allocation_rate}
              onChange={handleInputChange}
              error={validationErrors.allocation_rate}
              max={100}
            />
          </>
        )}
      </div>
      <EditProjectAssignmentTable />
      <div className='flex justify-between md:w-1/2'>
        <Button variant='primaryOutline' onClick={toggleCancelDialog}>
          Cancel
        </Button>
        <Button onClick={toggleSaveDialog}>Save</Button>
      </div>
      <Dialog open={showSaveDialog}>
        <Dialog.Title>Save</Dialog.Title>
        <Dialog.Description>Are you sure you want to save this project?</Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={toggleSaveDialog}>
            No
          </Button>
          <Button variant='primary' onClick={checkOverlap}>
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
          <Button variant='primary' onClick={handleCancel}>
            Yes
          </Button>
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
