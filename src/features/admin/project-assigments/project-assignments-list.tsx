import { useState, useEffect } from "react"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { ProjectTooltipContent } from "../../../components/shared/gantt-chart/project-tooltip-content"
import { ProjectColumn } from "../../../components/shared/gantt-chart/project-column"
import { ProjectHeader } from "../../../components/shared/gantt-chart/project-header"
import { searchProjectMembers } from "../../../redux/slices/project-members-slice"
import { Gantt, type Task, ViewMode } from "custom-gantt-task-react"
import "custom-gantt-task-react/dist/index.css"
import { getRoleVariant } from "../../../utils/variant"

export const ProjectAssignmentsList = () => {
  const appDispatch = useAppDispatch()
  const { project_members } = useAppSelector((state) => state.projectMembers)

  const [activeProjectMembers, setActiveProjectMembers] = useState<Task[]>([])

  useEffect(() => {
    void appDispatch(searchProjectMembers({}))
  }, [])

  useEffect(() => {
    const projectMembersData: Task[] = []
    const uniqueTeamMembers = new Set()
    const currentYear = new Date().getFullYear()
    const startOfYear = new Date(currentYear, 0, 1)
    const endOfYear = new Date(currentYear, 11, 31)

    if (project_members.length > 0) {
      const sortedProjectMembers = [...project_members]
      sortedProjectMembers.sort((a, b) => {
        const nameA = `${a.user?.last_name} ${a.user?.first_name}`.toLowerCase()
        const nameB = `${b.user?.last_name} ${b.user?.first_name}`.toLowerCase()

        if (nameA < nameB) {
          return -1
        } else if (nameA > nameB) {
          return 1
        } else {
          return 0
        }
      })

      sortedProjectMembers.forEach((project) => {
        const teamMemberId = project.user?.id.toString()

        if (!uniqueTeamMembers.has(teamMemberId)) {
          uniqueTeamMembers.add(teamMemberId)
          projectMembersData.push({
            start: startOfYear,
            end: endOfYear,
            name: project.user?.last_name + ", " + project.user?.first_name,
            id: "User " + teamMemberId ?? "",
            progress: 0,
            type: "project",
            hideChildren: false,
            styles: {
              backgroundColor: "transparent",
              progressColor: "transparent",
              backgroundSelectedColor: "transparent",
              progressSelectedColor: "transparent",
              textColor: "transparent",
            },
          })
        }

        projectMembersData.push({
          start: new Date(project.start_date ?? 0),
          end: new Date(project.end_date ?? 0),
          name: project.project?.name ?? "",
          id: `${project.id}`,
          progress: project.allocation_rate ?? 0,
          type: "task",
          project: "User " + teamMemberId,
          styles: {
            backgroundColor: getRoleVariant(project.role),
            progressColor: getRoleVariant(project.role),
            backgroundSelectedColor: getRoleVariant(project.role),
            progressSelectedColor: getRoleVariant(project.role),
          },
          role: project.role,
        })
      })
      setActiveProjectMembers(projectMembersData)
    } else {
      setActiveProjectMembers([])
    }
  }, [project_members])

  const handleExpanderClick = (selectedMember: Task) => {
    setActiveProjectMembers(
      activeProjectMembers.map((member) =>
        member.id === selectedMember.id ? selectedMember : member
      )
    )
  }

  return (
    <>
      <div className='flex-1 flex flex-col md:w-[1435px]'>
        <div className='flex flex-col'>
          {activeProjectMembers.length > 0 && (
            <Gantt
              tasks={activeProjectMembers}
              viewMode={ViewMode.Month}
              columnWidth={80}
              ganttHeight={440}
              onExpanderClick={handleExpanderClick}
              TooltipContent={ProjectTooltipContent}
              TaskListHeader={ProjectHeader}
              TaskListTable={ProjectColumn}
            />
          )}
        </div>
      </div>
    </>
  )
}
