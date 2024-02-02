import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Pagination } from "@components/shared/pagination/pagination"
import { getSkills, setCheckedSkills } from "@redux/slices/skills-slice"
import { Checkbox } from "@components/ui/checkbox/checkbox"

export const SelectSkillsTable = () => {
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const { skills, hasPreviousPage, hasNextPage, totalPages, checkedSkills } = useAppSelector(
    (state) => state.skills
  )

  useEffect(() => {
    void appDispatch(
      getSkills({
        name: searchParams.get("name") ?? undefined,
        skill_category_id: searchParams.get("skill_category_id") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      appDispatch(setCheckedSkills([...checkedSkills, ...skills]))
    } else {
      const skillIds = skills.map((skill) => skill.id)
      appDispatch(setCheckedSkills(checkedSkills.filter((skill) => !skillIds.includes(skill.id))))
    }
  }

  const handleClickCheckbox = (checked: boolean, skillId: number) => {
    if (checked) {
      const skill = skills.find((skill) => skill.id === skillId)
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
                    checked={skills.every((skill) =>
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
              {skills.map((skill) => (
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
