import { useState, useEffect } from "react"
import { useAppSelector } from "@hooks/useAppSelector"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { ProjectTooltipContent } from "@components/shared/gantt-chart/project-tooltip-content"
import { ProjectColumn } from "@components/shared/gantt-chart/project-column"
import { ProjectHeader } from "@components/shared/gantt-chart/project-header"
import { Gantt, type Task, ViewMode } from "custom-gantt-task-react"
import "custom-gantt-task-react/dist/index.css"
import { getRoleVariant, getDarkRoleVariant } from "@utils/variant"
import { type ProjectMember } from "@custom-types/project-member-type"
import { setCheckedSkills, setSelectedSkills } from "@redux/slices/skills-slice"
import { setProjectMemberFormData } from "@redux/slices/project-member-slice"

export const ProjectAssignmentsList = () => {
  const appDispatch = useAppDispatch()
  const { project_members } = useAppSelector((state) => state.projectMembers)

  const [activeProjectMembers, setActiveProjectMembers] = useState<Task[]>([])
  const [legendData, setLegendData] = useState<ProjectMember[]>([])

  useEffect(() => {
    void appDispatch(setSelectedSkills([]))
    void appDispatch(setCheckedSkills([]))
    void appDispatch(
      setProjectMemberFormData({
        project_id: "",
        user_id: "",
        project_role_id: "",
        start_date: "",
        end_date: "",
        allocation_rate: "",
        remarks: "",
        skill_ids: [],
      })
    )
  }, [])

  useEffect(() => {
    const projectMembersData: Task[] = []
    const uniqueTeamMembers = new Set()

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

      const { earliestStartDate, latestEndDate } = sortedProjectMembers.reduce(
        (acc, projectMember) => {
          const startDate = new Date(projectMember.start_date ?? "")
          const endDate = new Date(projectMember.end_date ?? "")

          if (acc.earliestStartDate === null || startDate < (acc.earliestStartDate ?? new Date())) {
            acc.earliestStartDate = startDate ?? new Date()
          }

          if (acc.latestEndDate === null || endDate > (acc.latestEndDate ?? new Date())) {
            acc.latestEndDate = endDate
          }

          return acc
        },
        {
          earliestStartDate: null as Date | null,
          latestEndDate: null as Date | null,
        }
      )

      sortedProjectMembers.forEach((project) => {
        const teamMemberId = project.user?.id.toString()

        if (!uniqueTeamMembers.has(teamMemberId)) {
          uniqueTeamMembers.add(teamMemberId)
          projectMembersData.push({
            start: earliestStartDate ?? new Date(),
            end: latestEndDate ?? new Date(),
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
            textColor: getDarkRoleVariant(project.role),
          },
          role: project.role,
          projectMemberId: project.id.toString(),
        })
      })
      setActiveProjectMembers(projectMembersData)

      const uniqueRolesSet = new Set()
      const legend = project_members.reduce((result: ProjectMember[], member: ProjectMember) => {
        const roleName = member.role
        if (!uniqueRolesSet.has(roleName)) {
          uniqueRolesSet.add(roleName)
          result.push({
            id: member.id,
            role: roleName,
            color: getRoleVariant(roleName),
          })
        }
        return result
      }, [])

      setLegendData(legend)
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
      <div className='flex-1 flex flex-col'>
        <div className='flex flex-col'>
          {activeProjectMembers.length > 0 && (
            <div className='flex flex-col gap-2'>
              <Gantt
                tasks={activeProjectMembers}
                viewMode={ViewMode.Month}
                columnWidth={80}
                ganttHeight={400}
                onExpanderClick={handleExpanderClick}
                TooltipContent={ProjectTooltipContent}
                TaskListHeader={ProjectHeader}
                TaskListTable={ProjectColumn}
              />
              <div className='flex gap-4 justify-center'>
                {legendData.map((item) => (
                  <div key={item.id} className='flex items-center mb-2'>
                    <div className='w-4 h-4 mr-2' style={{ backgroundColor: item.color }}></div>
                    <span>{item.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
