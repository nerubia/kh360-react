import { useRef, useState, lazy, Suspense } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { Button } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { setSelectedSkills, setCheckedSkills } from "@redux/slices/skills-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useFullPath } from "@hooks/use-full-path"
import { DateRangePicker } from "@components/ui/date-range-picker/date-range-picker"
import { type DateValueType } from "react-tailwindcss-datepicker"

export const EditProjectAssignmentTable = () => {
  const fullPath = useFullPath()
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { selectedSkills } = useAppSelector((state) => state.skills)
  const { project } = useAppSelector((state) => state.project)
  const { projectMemberFormData } = useAppSelector((state) => state.projectMember)
  const [selectedSkillIndex, setSelectedSkillIndex] = useState<number>(0)
  const [showRedirectDialog, setShowRedirectDialog] = useState<boolean>(false)
  const dragContent = useRef<number>(0)
  const draggedOverContent = useRef<number>(0)

  const ProjectAssignmentsDialog = lazy(
    async () => await import("@features/admin/project-assigments/project-assignments-dialog")
  )

  const toggleRedirectDialog = () => {
    setShowRedirectDialog((prev) => !prev)
  }

  const handleDelete = () => {
    const updatedSkills = selectedSkills.filter((_, index) => index !== selectedSkillIndex)
    void appDispatch(setSelectedSkills(updatedSkills))
    void appDispatch(setCheckedSkills(updatedSkills))
  }

  const handleAddSkill = () => {
    navigate(`/admin/project-assignments/select/${project?.id}?callback=${fullPath}`)
  }

  const handleViewProject = () => {
    navigate(`/admin/projects/${project?.id}`)
  }

  const handleSort = () => {
    const selectedSkillsData = [...selectedSkills]
    const draggedItem = selectedSkillsData[dragContent.current]

    selectedSkillsData.splice(dragContent.current, 1)
    selectedSkillsData.splice(draggedOverContent.current, 0, draggedItem)

    void appDispatch(setSelectedSkills(selectedSkillsData))
    void appDispatch(setCheckedSkills(selectedSkillsData))
  }

  const handleDateRangeChange = (index: number, value: DateValueType) => {
    const updatedSkills = selectedSkills.map((skill, i) =>
      i === index
        ? {
            ...skill,
            start_date: value?.startDate,
            end_date: value?.endDate,
          }
        : skill
    )
    void appDispatch(setSelectedSkills(updatedSkills))
    void appDispatch(setCheckedSkills(updatedSkills))
  }

  return (
    <>
      {projectMemberFormData?.project_id !== undefined &&
      projectMemberFormData.project_id.length > 0 ? (
        <div className='flex-2 flex flex-col gap-5 overflow-y-scroll'>
          <div className='text-xl text-primary-500 font-bold'>Skills</div>
          <table>
            <thead className='text-left'>
              <tr>
                <th className='p-2 border-b-4 text-primary-500 md:w-3/12'>Category</th>
                <th className='p-2 border-b-4 text-start text-primary-500 md:w-3/12'>Name</th>
                <th className='p-2 border-b-4 text-start text-primary-500 md:w-3/12'>
                  Assignment Duration
                </th>
                <th className='p-2 border-b-4 text-center text-primary-500 md:w-1/10'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedSkills.map((skill, index) => (
                <tr
                  key={index}
                  className='hover:bg-slate-100 cursor-grab'
                  draggable
                  onDragStart={() => {
                    dragContent.current = index
                  }}
                  onDragEnter={() => (draggedOverContent.current = index)}
                  onDragEnd={() => {
                    handleSort()
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <td className='p-2 border-b'>
                    <div className='flex gap-3 items-center'>
                      <Icon icon='Menu' size='extraSmall' />
                      <div>{skill?.skill_categories?.name}</div>
                    </div>
                  </td>
                  <td className='p-2 border-b text-start'>
                    <div>{skill?.name}</div>
                  </td>
                  <td className='p-2 border-b text-start'>
                    <DateRangePicker
                      name='skill-duration'
                      value={{
                        startDate: skill.start_date ?? projectMemberFormData.start_date ?? "",
                        endDate: skill.end_date ?? projectMemberFormData.end_date ?? "",
                      }}
                      onChange={(value) => handleDateRangeChange(index, value)}
                      dateLimit={{ start_date: project?.start_date, end_date: project?.end_date }}
                    />
                  </td>
                  <td className='p-2 border-b items-center'>
                    <div className='flex gap-2 justify-center'>
                      <Button
                        testId={`DeleteButton${skill.id}`}
                        variant='unstyled'
                        onClick={() => {
                          setSelectedSkillIndex(index)
                          handleDelete()
                        }}
                      >
                        <Icon icon='Trash' size='small' />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {project?.project_skills?.length === 0 ? (
            <div className='pb-4 pl-2 border-b'>
              Project skills unavailable. View project details for{" "}
              <span
                onClick={toggleRedirectDialog}
                className='text-primary-500 cursor-pointer underline'
              >
                {" "}
                {project?.name}
              </span>{" "}
              to add skills.
            </div>
          ) : (
            <>
              {selectedSkills.length === 0 ? (
                <div className='pb-4 pl-2 border-b'>
                  No skills added yet. Click{" "}
                  <span
                    onClick={handleAddSkill}
                    className='text-primary-500 cursor-pointer underline'
                  >
                    {" "}
                    here
                  </span>{" "}
                  to add.
                </div>
              ) : (
                <div className='flex justify-start pb-10'>
                  <Button onClick={handleAddSkill} variant={"ghost"}>
                    <Icon icon='Plus' size='small' color='primary' />
                    <p className='text-primary-500 uppercase whitespace-nowrap text-sm'>
                      Add Skill
                    </p>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      ) : null}
      <Suspense>
        <ProjectAssignmentsDialog
          open={showRedirectDialog}
          title='Redirect'
          description={
            <>
              Are you sure you want to redirect to view {project?.name}?
              <br /> If you redirect now, your data won&apos;t be saved.
            </>
          }
          onClose={toggleRedirectDialog}
          onSubmit={handleViewProject}
        />
      </Suspense>
    </>
  )
}
