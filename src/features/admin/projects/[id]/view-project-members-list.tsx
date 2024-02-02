import { useState, useEffect } from "react"
import { useAppSelector } from "@hooks/useAppSelector"
import { ProjectTooltipContent } from "@components/shared/gantt-chart/project-tooltip-content"
import { ViewProjectMemberColumn } from "@components/shared/gantt-chart/view-project-member-column"
import { ViewProjectMemberHeader } from "@components/shared/gantt-chart/view-project-member-header"
import { Gantt, type Task, ViewMode } from "custom-gantt-task-react"
import "custom-gantt-task-react/dist/index.css"
import { getRoleVariant, getDarkRoleVariant } from "@utils/variant"
import { type ProjectMember } from "@custom-types/project-member-type"
import { type SkillCategory } from "@custom-types/skill-category-type"
import { type ProjectMemberSkill } from "@custom-types/project-member-skill-type"

export const ViewProjectMembersList = () => {
  const { project } = useAppSelector((state) => state.project)

  const [activeProjectMembers, setActiveProjectMembers] = useState<Task[]>([])
  const [legendData, setLegendData] = useState<ProjectMember[]>([])

  useEffect(() => {
    const projectMembersData: Task[] = []
    const uniqueTeamMembers = new Set()

    if (project?.project_members !== undefined) {
      const sortedProjectMembers = [...project.project_members]
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

      sortedProjectMembers.forEach((projectMember) => {
        const teamMemberId = projectMember.user?.id.toString()

        if (!uniqueTeamMembers.has(teamMemberId)) {
          uniqueTeamMembers.add(teamMemberId)
          projectMembersData.push({
            start: earliestStartDate ?? new Date(),
            end: latestEndDate ?? new Date(),
            name: projectMember.user?.last_name + ", " + projectMember.user?.first_name,
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

        const skills: ProjectMemberSkill[] = projectMember.project_member_skills ?? []
        const groupedSkillsByCategory = skills?.reduce((grouped: SkillCategory[], skill) => {
          const category = skill.skills.skill_categories?.name
          const categoryId = skill.skills.skill_categories?.id
          const skillSequenceNo = skill.sequence_no

          const existingCategory = grouped.find((category) => category.id === categoryId)

          if (existingCategory !== undefined) {
            existingCategory.project_skills?.push({
              ...skill.skills,
              sequence_no: skillSequenceNo,
            })
            existingCategory.project_skills?.sort((a, b) => a.sequence_no - b.sequence_no)
          } else {
            grouped.push({
              name: category,
              id: categoryId,
              sequence_no: skill.skills.skill_categories.sequence_no,
              project_skills: [{ ...skill.skills, sequence_no: skillSequenceNo }],
            })
          }

          return grouped
        }, [])

        groupedSkillsByCategory?.sort((a, b) => (a.sequence_no ?? 0) - (b.sequence_no ?? 0))

        const skillsInTooltip = groupedSkillsByCategory.map((skillCategory) => {
          const skillNames = skillCategory.project_skills?.map((skill) => skill.name).join(", ")

          return `${skillNames}\n`
        })

        projectMembersData.push({
          start: new Date(projectMember.start_date ?? 0),
          end: new Date(projectMember.end_date ?? 0),
          name: "",
          id: `${projectMember.id}`,
          progress: projectMember.allocation_rate ?? 0,
          type: "task",
          project: "User " + teamMemberId,
          styles: {
            backgroundColor: getRoleVariant(projectMember.role),
            progressColor: getRoleVariant(projectMember.role),
            backgroundSelectedColor: getRoleVariant(projectMember.role),
            progressSelectedColor: getRoleVariant(projectMember.role),
            textColor: getDarkRoleVariant(projectMember.role),
          },
          role: projectMember.role,
          dependencies: skillsInTooltip,
        })
      })

      setActiveProjectMembers(projectMembersData)

      const uniqueRolesSet = new Set()
      const legend = project.project_members.reduce(
        (result: ProjectMember[], member: ProjectMember) => {
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
        },
        []
      )

      setLegendData(legend)
    } else {
      setActiveProjectMembers([])
    }
  }, [project])

  return (
    <>
      <div className='flex-1 flex flex-col gap-5 md:w-full overflow-y-scroll'>
        <div className='text-xl text-primary-500 font-bold'>Project Members</div>
        <div className='flex flex-col'>
          {activeProjectMembers.length > 0 ? (
            <div className='flex flex-col gap-2'>
              <Gantt
                tasks={activeProjectMembers}
                viewMode={ViewMode.Month}
                columnWidth={80}
                ganttHeight={200}
                TooltipContent={ProjectTooltipContent}
                TaskListHeader={ViewProjectMemberHeader}
                TaskListTable={ViewProjectMemberColumn}
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
          ) : (
            <div>Not found</div>
          )}
        </div>
      </div>
    </>
  )
}
