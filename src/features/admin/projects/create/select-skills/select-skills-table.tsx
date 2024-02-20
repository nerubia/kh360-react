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
      <div className='flex-1 flex flex-col overflow-y-scroll'>
        <div className='flex pl-2'>
          <Checkbox
            checked={skills.every((skill) =>
              checkedSkills.map((skill) => skill.id).includes(skill.id)
            )}
            onChange={(checked) => handleSelectAll(checked)}
          />
          <div className='py-3 px-3 font-bold'>Select All</div>
        </div>
        <div className='flex flex-col'>
          <div className='columns-5 gap-4'>
            {skills.map((skill) => (
              <div key={skill.id} className='flex hover:bg-slate-100'>
                <div className='py-2 px-2 '>
                  <Checkbox
                    checked={checkedSkills.map((skill) => skill.id).includes(skill.id)}
                    onChange={(checked) => handleClickCheckbox(checked, skill.id)}
                  />
                </div>
                <div className='py-2 px-2 whitespace-pre-line break-all'>{skill.name}</div>
              </div>
            ))}
          </div>
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
