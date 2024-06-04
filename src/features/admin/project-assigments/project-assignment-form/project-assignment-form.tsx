import React, { useEffect, useState, useRef, lazy, Suspense } from "react"
import { type SelectInstance, type GroupBase } from "react-select"
import { debounce } from "lodash"
import { Button } from "@components/ui/button/button"
import { CustomSelect } from "@components/ui/select/custom-select"
import { Input } from "@components/ui/input/input"
import { type Option } from "@custom-types/optionType"
import { useAppSelector } from "@hooks/useAppSelector"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { getUsersOnScroll } from "@redux/slices/users-slice"
import { getProjectsOnScroll } from "@redux/slices/projects-slice"
import { getProjectRoles } from "@redux/slices/project-roles-slice"
import { type ProjectMemberFormData } from "@custom-types/form-data-type"
import { createProjectMember, searchProjectMembers } from "@redux/slices/project-members-slice"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { ValidationError } from "yup"
import { createProjectMemberSchema } from "@utils/validation/project-member-schema"
import { formatDateRange } from "@utils/format-date"
import {
  getProjectMember,
  setProjectMember,
  updateProjectMember,
  setProjectMemberFormData,
  setIsEditingProjectMember,
} from "@redux/slices/project-member-slice"
import { Loading } from "@custom-types/loadingType"
import { EditProjectAssignmentTable } from "@features/admin/project-assigments/[id]/edit/edit-project-assignment-table"
import { setSelectedSkills, setCheckedSkills } from "@redux/slices/skills-slice"
import { getProject } from "@redux/slices/project-slice"
import { setAlert } from "@redux/slices/app-slice"
import { setProjectSkills } from "@redux/slices/project-skills-slice"
import { DateRangePicker } from "@components/ui/date-range-picker/date-range-picker"
import { type DateValueType } from "react-tailwindcss-datepicker"

export const ProjectAssignmentForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const project_name = searchParams.get("project_name")
  const project_id = searchParams.get("project_id")
  const { project } = useAppSelector((state) => state.project)

  const {
    loading: loadingUsers,
    users,
    hasNextPage,
    currentPage,
  } = useAppSelector((state) => state.users)
  const {
    projects,
    hasNextPage: projectHasNextPage,
    loading: loadingProject,
    currentPage: projectCurrentPage,
  } = useAppSelector((state) => state.projects)
  const { project_member, projectMemberFormData, isEditingProjectMember } = useAppSelector(
    (state) => state.projectMember
  )
  const { project_members } = useAppSelector((state) => state.projectMembers)
  const { project_roles } = useAppSelector((state) => state.projectRoles)
  const { selectedSkills } = useAppSelector((state) => state.skills)

  const [activeUsers, setActiveUsers] = useState<Option[]>([])
  const [activeProjects, setActiveProjects] = useState<Option[]>([])
  const [activeProjectRoles, setActiveProjectRoles] = useState<Option[]>([])

  const [validationErrors, setValidationErrors] = useState<Partial<ProjectMemberFormData>>({})
  const [isFocused, setIsFocused] = useState(false)
  const scrollDownRef = useRef<HTMLDivElement | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false)
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)
  const [showOverlapDialog, setShowOverlapDialog] = useState<boolean>(false)

  const [employeeMenuList, setEmployeeMenuList] = useState<HTMLDivElement | null | undefined>(null)
  const [projectMenuList, setProjectMenuList] = useState<HTMLDivElement | null | undefined>(null)

  const customEmployeeRef = useRef<SelectInstance<Option, false, GroupBase<Option>>>(null)
  const customProjectRef = useRef<SelectInstance<Option, false, GroupBase<Option>>>(null)

  const ProjectAssignmentsDialog = lazy(
    async () => await import("@features/admin/project-assigments/project-assignments-dialog")
  )

  const handleFocus = () => {
    setIsFocused(true)
  }
  const handleDatepickerBlur = () => {
    setIsFocused(false)
  }
  useEffect(() => {
    if (isFocused && scrollDownRef.current != null) {
      scrollDownRef.current.scrollIntoView()
    }
  }, [isFocused])

  useEffect(() => {
    void appDispatch(getProjectRoles())
    void appDispatch(setProjectSkills([]))
    if (id !== undefined) {
      void appDispatch(getProjectMember(parseInt(id)))
    }
    if (project_id !== null) {
      void appDispatch(getProject(parseInt(project_id)))
    }
  }, [])

  useEffect(() => {
    employeeMenuList?.addEventListener("scroll", handleEmployeeScroll)
    return () => {
      employeeMenuList?.removeEventListener("scroll", handleEmployeeScroll)
    }
  }, [loadingUsers, employeeMenuList])

  useEffect(() => {
    projectMenuList?.addEventListener("scroll", handleProjectScroll)
    return () => {
      projectMenuList?.removeEventListener("scroll", handleProjectScroll)
    }
  }, [loadingProject, projectMenuList])

  useEffect(() => {
    const isEditing = project_member !== null && project_id === null && !isEditingProjectMember

    if (isEditing) {
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
        void appDispatch(getProject(project_member.project_id ?? project_id))
      }
      const skillsCopy = [...(project_member.project_member_skills ?? [])]
      const sortedSkills = skillsCopy?.sort((a, b) => {
        return (a.sequence_no ?? 0) - (b.sequence_no ?? 0)
      })
      const sortedSelectedSkills = sortedSkills.map((skill) => ({
        ...skill.skills,
        start_date: skill.start_date,
        end_date: skill.end_date,
      }))
      void appDispatch(setSelectedSkills(sortedSelectedSkills))
      void appDispatch(setCheckedSkills(sortedSelectedSkills))
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

  useEffect(() => {
    if (
      projectMemberFormData?.project_member_name !== null &&
      projectMemberFormData?.project_member_name !== undefined
    ) {
      void appDispatch(
        getUsersOnScroll({
          name: projectMemberFormData?.project_member_name,
        })
      )
    }
  }, [projectMemberFormData?.user_id])

  useEffect(() => {
    if (
      projectMemberFormData?.project_id !== null &&
      projectMemberFormData?.project_name !== undefined
    ) {
      void appDispatch(
        getProjectsOnScroll({
          name: projectMemberFormData?.project_name,
        })
      )
    }
  }, [projectMemberFormData?.project_id])

  useEffect(() => {
    if (project_name !== null) {
      void appDispatch(
        getProjectsOnScroll({
          name: project_name,
        })
      )
      if (!isEditingProjectMember) {
        void appDispatch(
          setProjectMemberFormData({
            project_id,
            project_name,
          })
        )
      } else {
        void appDispatch(
          setProjectMemberFormData({
            ...projectMemberFormData,
            project_id,
            project_name,
          })
        )
      }
    }
  }, [project_name])

  const toggleSaveDialog = async () => {
    setShowSaveDialog((prev) => !prev)
  }

  const toggleCancelDialog = async () => {
    setShowCancelDialog((prev) => !prev)
  }

  const toggleOverlapDialog = async () => {
    setShowOverlapDialog((prev) => !prev)
  }

  const handleEmployeeScroll = () => {
    if (employeeMenuList?.scrollTop !== undefined) {
      const offset = 10
      const scrollPosition = employeeMenuList?.scrollTop + employeeMenuList.clientHeight
      if (
        scrollPosition < employeeMenuList.scrollHeight - offset ||
        loadingUsers === Loading.Pending ||
        !hasNextPage
      ) {
        return
      }
    }
    const newPage = currentPage + 1
    void appDispatch(
      getUsersOnScroll({
        page: newPage.toString(),
      })
    )
  }

  const handleProjectScroll = () => {
    if (projectMenuList?.scrollTop !== undefined) {
      const offset = 10
      const scrollPosition = projectMenuList?.scrollTop + projectMenuList.clientHeight
      if (
        scrollPosition < projectMenuList.scrollHeight - offset ||
        loadingProject === Loading.Pending ||
        !projectHasNextPage
      ) {
        return
      }
    }
    if (projectHasNextPage) {
      const newPage = projectCurrentPage + 1
      void appDispatch(
        getProjectsOnScroll({
          page: newPage.toString(),
        })
      )
    }
  }

  const handleSearchUser = (value: string) => {
    if (value.length !== 0) {
      void appDispatch(
        getUsersOnScroll({
          name: value,
        })
      )
    } else {
      void appDispatch(getUsersOnScroll({}))
    }
  }

  const handleSearchProject = (value: string) => {
    if (value.length !== 0) {
      void appDispatch(
        getProjectsOnScroll({
          name: value,
        })
      )
    } else {
      void appDispatch(getProjectsOnScroll({}))
    }
  }

  const debouncedSearchUser = debounce(handleSearchUser, 500)
  const debouncedSearchProject = debounce(handleSearchProject, 500)

  const checkOverlap = async () => {
    try {
      if (projectMemberFormData !== null) {
        await toggleSaveDialog()
        const skills = selectedSkills.map((skill) => ({
          id: skill.id,
          start_date: skill.start_date ?? projectMemberFormData.start_date,
          end_date: skill.end_date ?? projectMemberFormData.end_date,
        }))
        await createProjectMemberSchema.validate(
          { ...projectMemberFormData, skills },
          {
            abortEarly: false,
          }
        )
        const existingProjectMemberIds = project_members.map((member) => member.id)
        const userId = projectMemberFormData?.user_id
        const parsedUserId = userId !== undefined ? parseInt(userId, 10) : undefined

        if (userId !== undefined && parsedUserId !== undefined && !isNaN(parsedUserId)) {
          if (project_members.length > 0 && !existingProjectMemberIds.includes(parsedUserId)) {
            setShowOverlapDialog(true)
            return
          }
        }

        if (id !== undefined) {
          void handleEdit()
        } else {
          void handleSubmit()
        }
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<ProjectMemberFormData> = {}
        error.inner.forEach((err) => {
          const key = err.path as keyof ProjectMemberFormData
          if (key !== "skills") {
            errors[key] = err.message
          }
        })
        setValidationErrors(errors)
      }
    }
  }

  const handleSubmit = async () => {
    try {
      if (projectMemberFormData !== null) {
        await toggleSaveDialog()
        const skills = selectedSkills.map((skill) => ({
          id: skill.id,
          start_date: skill.start_date ?? projectMemberFormData.start_date,
          end_date: skill.end_date ?? projectMemberFormData.end_date,
        }))
        const result = await appDispatch(createProjectMember({ ...projectMemberFormData, skills }))
        if (result.type === "projectMember/createProjectMember/fulfilled") {
          appDispatch(
            setAlert({
              description: "Project assignment has been added successfully.",
              variant: "success",
            })
          )
          if (project_id !== null) {
            navigate(`/admin/projects/${project_id}`)
          } else {
            navigate("/admin/project-assignments")
          }
        }
        if (result.type === "projectMember/createProjectMember/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
          setShowOverlapDialog(false)
          setShowSaveDialog(false)
        }
      }
    } catch (error) {}
  }

  const handleEdit = async () => {
    try {
      await toggleSaveDialog()
      if (id !== undefined) {
        const skills = selectedSkills.map((skill) => ({
          id: skill.id,
          start_date: skill.start_date ?? projectMemberFormData?.start_date,
          end_date: skill.end_date ?? projectMemberFormData?.end_date,
        }))
        const result = await appDispatch(
          updateProjectMember({
            project_member: { ...projectMemberFormData, skills },
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
          setShowOverlapDialog(false)
          setShowSaveDialog(false)
        }
      }
    } catch (error) {}
  }

  const handleCancel = () => {
    void appDispatch(setProjectMember(null))
    void appDispatch(setSelectedSkills([]))
    void appDispatch(setCheckedSkills([]))
    if (project_id !== null) {
      navigate(`/admin/projects/${project_id}`)
    } else {
      navigate("/admin/project-assignments")
    }
  }

  const handleOnEmployeeMenuOpen = () => {
    setTimeout(() => {
      setEmployeeMenuList(customEmployeeRef?.current?.menuListRef)
    }, 100)
  }

  const handleOnProjectMenuOpen = () => {
    setTimeout(() => {
      setProjectMenuList(customProjectRef?.current?.menuListRef)
    }, 100)
  }
  const handleDateRangeChange = (value: DateValueType) => {
    void appDispatch(setIsEditingProjectMember(true))

    const startDate = value?.startDate != null ? value.startDate.toString().split("T")[0] : ""
    const endDate = value?.endDate != null ? value.endDate.toString().split("T")[0] : ""

    void appDispatch(
      setProjectMemberFormData({
        ...projectMemberFormData,
        start_date: startDate,
        end_date: endDate,
      })
    )
  }

  const checkNumberValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    void appDispatch(
      setProjectMemberFormData({
        ...projectMemberFormData,
        allocation_rate: handleDecimalsOnValue(inputValue),
      })
    )
    void appDispatch(setIsEditingProjectMember(true))
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
    return projectMemberFormData?.allocation_rate
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col xl:w-1/2 gap-4'>
        <CustomSelect
          customRef={customEmployeeRef}
          onMenuOpen={handleOnEmployeeMenuOpen}
          data-test-id='EmployeeName'
          label='Employee Name'
          name='employee_name'
          value={activeUsers.find((option) => option.value === projectMemberFormData?.user_id)}
          onChange={(option) => {
            void appDispatch(setIsEditingProjectMember(true))
            void appDispatch(
              setProjectMemberFormData({
                ...projectMemberFormData,
                user_id: option?.value,
                project_member_name: option?.label,
              })
            )
          }}
          onInputChange={(value) => debouncedSearchUser(value)}
          options={activeUsers}
          fullWidth
          error={validationErrors.user_id}
          isClearable
          disabled={id !== undefined}
        />
        <CustomSelect
          customRef={customProjectRef}
          onMenuOpen={handleOnProjectMenuOpen}
          data-test-id='Project'
          label='Project'
          name='project'
          value={activeProjects.find(
            (option) => option.value === projectMemberFormData?.project_id
          )}
          onChange={(option) => {
            void appDispatch(setIsEditingProjectMember(true))
            void appDispatch(
              setProjectMemberFormData({
                ...projectMemberFormData,
                project_id: option?.value,
                project_name: option?.label,
              })
            )
            if (option !== null) {
              void appDispatch(getProject(parseInt(option.value)))
            }
            void appDispatch(setSelectedSkills([]))
            void appDispatch(setCheckedSkills([]))
          }}
          onInputChange={(value) => debouncedSearchProject(value)}
          options={activeProjects}
          fullWidth
          error={validationErrors.project_id}
          isClearable
          disabled={(id === undefined && project_name !== null) || id !== undefined}
        />
        <CustomSelect
          data-test-id='ProjectRole'
          label='Role'
          name='role'
          value={activeProjectRoles.find(
            (option) => option.value === projectMemberFormData?.project_role_id
          )}
          onChange={(option) => {
            void appDispatch(setIsEditingProjectMember(true))
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
        <div className='flex flex-row gap-5'>
          <div className='flex-1' onFocus={handleFocus} onBlur={handleDatepickerBlur}>
            <DateRangePicker
              name='assignment-duration'
              label='Assignment Duration'
              value={{
                startDate: projectMemberFormData?.start_date ?? "",
                endDate: projectMemberFormData?.end_date ?? "",
              }}
              onChange={handleDateRangeChange}
              error={{
                start_date: validationErrors.start_date,
                end_date: validationErrors.end_date,
              }}
              dateLimit={{ start_date: project?.start_date, end_date: project?.end_date }}
            />
          </div>
          <div className='flex flex-col'>
            <h2 className='font-medium'>Allocation Rate</h2>
            <div className='flex flex-row items-end pt-1 gap-1'>
              <Input
                name='allocation_rate'
                type='number'
                placeholder='Allocation rate'
                value={projectMemberFormData?.allocation_rate ?? ""}
                onChange={(event) => checkNumberValue(event)}
                error={validationErrors.allocation_rate}
                max={100}
              />
              <h2
                className={`font-medium ${
                  validationErrors.allocation_rate != null ? "pb-6.5" : "pb-2"
                }`}
              >
                %
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className='xl:w-2/3'>
        <EditProjectAssignmentTable />
        <div className='flex justify-between mt-20'>
          <Button variant='primaryOutline' onClick={toggleCancelDialog}>
            Cancel
          </Button>
          <Button onClick={toggleSaveDialog}>Save</Button>
        </div>
      </div>
      <Suspense>
        <ProjectAssignmentsDialog
          open={showSaveDialog}
          title='Save'
          description='Are you sure you want to save this project assignment?'
          onClose={toggleSaveDialog}
          onSubmit={checkOverlap}
        />
      </Suspense>
      <div ref={scrollDownRef} />
      <Suspense>
        <ProjectAssignmentsDialog
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
      <Suspense>
        <ProjectAssignmentsDialog
          open={showOverlapDialog}
          title='Warning'
          description={
            <>
              Hey there!
              <br />
              <br />
              We&apos;ve detected a potential overlap in project assignments based on the
              information you&apos;re adding. Before we proceed, we want to ensure you&apos;re aware
              of this and give you the option to reconsider.
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
            </>
          }
          onClose={toggleOverlapDialog}
          onSubmit={async () => (id === undefined ? await handleSubmit() : await handleEdit())}
          closeButtonLabel='Cancel'
          submitButtonLabel='Continue'
        />
      </Suspense>
    </div>
  )
}
