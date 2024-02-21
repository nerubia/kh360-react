import React, { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { Loading } from "@custom-types/loadingType"
import { type SkillCategory } from "@custom-types/skill-category-type"

export const ViewProjectTable = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { loading, project } = useAppSelector((state) => state.project)
  const [groupedProjectSkills, setGroupedProjectSkills] = useState<SkillCategory[]>([])
  const location = useLocation()

  useEffect(() => {
    const groupedSkillsByCategory = project?.project_skills?.reduce(
      (grouped: SkillCategory[], skill) => {
        const category = skill.skill_categories.name
        const categoryId = skill.skill_categories.id

        const existingCategory = grouped.find((category) => category.id === categoryId)

        if (existingCategory !== undefined) {
          existingCategory.project_skills?.push(skill)
          existingCategory.project_skills?.sort((a, b) => a.sequence_no - b.sequence_no)
        } else {
          grouped.push({
            name: category,
            id: categoryId,
            sequence_no: skill.skill_categories.sequence_no,
            project_skills: [skill],
          })
        }

        return grouped
      },
      []
    )

    groupedSkillsByCategory?.sort((a, b) => (a.sequence_no ?? 0) - (b.sequence_no ?? 0))

    setGroupedProjectSkills(groupedSkillsByCategory ?? [])
  }, [project])

  const handleSelectSkills = () => {
    navigate(
      `/admin/projects/create/select-skills?project_name=${project?.name}&id=${project?.id}&callback=${location.pathname}`
    )
  }

  return (
    <>
      <div className='flex-2 flex flex-col gap-5 overflow-y-scroll'>
        <div className='text-xl text-primary-500 font-bold'>Skills Used</div>
        {loading === Loading.Pending && <div>Loading...</div>}
        {loading === Loading.Fulfilled && groupedProjectSkills.length === 0 && (
          <div>
            No skills added yet. Click{" "}
            <span
              onClick={handleSelectSkills}
              className='text-primary-500 cursor-pointer underline'
            >
              {" "}
              here
            </span>{" "}
            to add.
          </div>
        )}
        {loading === Loading.Fulfilled && groupedProjectSkills.length > 0 && id !== undefined && (
          <>
            <table>
              <thead className='text-left'>
                <tr>
                  <th className='py-1 border-b-4 mr-2 text-primary-500 md:w-1/4'>Category</th>
                  <th className='py-1 border-b-4 mr-2 text-start text-primary-500 md:w-1/2'>
                    Skills
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupedProjectSkills.map((skill, index) => (
                  <tr key={index} className='hover:bg-slate-100'>
                    <td className='py-1 border-b'>{skill?.name}</td>
                    <td className='py-1 border-b text-start'>
                      {skill?.project_skills?.map((projectSkill, index) => (
                        <React.Fragment key={index}>
                          {projectSkill.name}{" "}
                          {index !== (skill.project_skills?.length ?? 1) - 1 && ", "}{" "}
                        </React.Fragment>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  )
}
