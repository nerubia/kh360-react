import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Pagination } from "@components/shared/pagination/pagination"
import { setCheckedSkills } from "@redux/slices/skills-slice"
import { Checkbox } from "@components/ui/checkbox/checkbox"
import { type Skill } from "@custom-types/skill-type"
import { getProjectSkills } from "@redux/slices/project-skills-slice"

export const SelectProjectMemberSkillsTable = () => {
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const { checkedSkills } = useAppSelector((state) => state.skills)
  const { project } = useAppSelector((state) => state.project)
  const { projectMemberFormData } = useAppSelector((state) => state.projectMember)
  const { project_skills, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.projectSkills
  )
  const [projectSkills, setProjectSkills] = useState<Skill[]>([])

  useEffect(() => {
    if (project !== null) {
      const projectSkillIds = project.project_skills?.map((skill) => skill.id)
      const filteredSkills = project_skills.filter((skill) => projectSkillIds?.includes(skill.id))
      setProjectSkills(filteredSkills)
    }
  }, [project, project_skills])

  useEffect(() => {
    void appDispatch(
      getProjectSkills({
        project_id: projectMemberFormData?.project_id,
        name: searchParams.get("name") ?? undefined,
        skill_category_id: searchParams.get("skill_category_id") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      appDispatch(setCheckedSkills([...checkedSkills, ...project_skills]))
    } else {
      const skillIds = project_skills.map((skill) => skill.id)
      appDispatch(setCheckedSkills(checkedSkills.filter((skill) => !skillIds.includes(skill.id))))
    }
  }

  const handleClickCheckbox = (checked: boolean, skillId: number) => {
    if (checked) {
      const skill = project_skills.find((skill) => skill.id === skillId)
      appDispatch(setCheckedSkills([...checkedSkills, skill]))
    } else {
      const filteredSkills = checkedSkills.filter((skill) => skill.id !== skillId)
      appDispatch(setCheckedSkills(filteredSkills))
    }
  }

  return (
    <>
      <div className='flex-1 flex flex-col gap-8 overflow-y-scroll'>
        <div className='flex flex-col gap-8'>
          <table className='w-full'>
            <thead className='text-left'>
              <tr>
                <th className='py-3 pr-3 w-1/20'>
                  <Checkbox
                    checked={project_skills.every((skill) =>
                      checkedSkills.map((skill) => skill.id).includes(skill.id)
                    )}
                    onChange={(checked) => handleSelectAll(checked)}
                  />
                </th>
                <th className='py-3 px-3 w-2/5'>Category</th>
                <th className='py-3 px-3 w-3/5'>Name</th>
              </tr>
            </thead>
            <tbody>
              {projectSkills.map((skill) => (
                <tr key={skill.id} className='hover:bg-slate-100'>
                  <td className='py-3 pr-3'>
                    <div>
                      <Checkbox
                        checked={checkedSkills.map((skill) => skill.id).includes(skill.id)}
                        onChange={(checked) => handleClickCheckbox(checked, skill.id)}
                      />
                    </div>
                  </td>
                  <td className='py-3 px-3 whitespace-pre-line break-all'>
                    {skill.skill_categories.name}
                  </td>
                  <td className='py-3 px-3 whitespace-pre-line break-all'>{skill.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages !== 1 && (
        <div className='flex justify-center'>
          <Pagination
            hasPreviousPage={hasPreviousPage}
            hasNextPage={hasNextPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </>
  )
}
