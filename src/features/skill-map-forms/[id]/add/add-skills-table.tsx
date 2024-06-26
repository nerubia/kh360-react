import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Pagination } from "@components/shared/pagination/pagination"
import { getSkillsUser } from "@redux/slices/skills-slice"
import { setCheckedUserSkills } from "@redux/slices/user-skills-slice"
import { Checkbox } from "@components/ui/checkbox/checkbox"

export const AddSkillsTable = () => {
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const { skills, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.skills
  )
  const { user_skill_map_ratings } = useAppSelector((state) => state.user)

  const { checkedUserSkills } = useAppSelector((state) => state.userSkills)

  useEffect(() => {
    void appDispatch(
      getSkillsUser({
        name: searchParams.get("name") ?? undefined,
        skill_category_id: searchParams.get("skill_category_id") ?? undefined,
        status: "Active",
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      appDispatch(setCheckedUserSkills([...checkedUserSkills, ...skills]))
    } else {
      const skillIds = skills.map((skill) => skill.id)
      appDispatch(
        setCheckedUserSkills(checkedUserSkills.filter((skill) => !skillIds.includes(skill.id)))
      )
    }
  }

  const handleClickCheckbox = (checked: boolean, skillId: number) => {
    if (checked) {
      const skill = skills.find((skill) => skill.id === skillId)
      appDispatch(setCheckedUserSkills([...checkedUserSkills, skill]))
    } else {
      const filteredSkills = checkedUserSkills.filter((skill) => skill.id !== skillId)
      appDispatch(setCheckedUserSkills(filteredSkills))
    }
  }

  return (
    <>
      <div className='flex-1 flex flex-col overflow-y-scroll'>
        <div className='flex pl-2'>
          <>
            {skills.length === 0 ? (
              "No skills available for this category."
            ) : (
              <>
                <Checkbox
                  checked={skills.every((skill) =>
                    checkedUserSkills.map((skill) => skill.id).includes(skill.id)
                  )}
                  onChange={(checked) => handleSelectAll(checked)}
                />
                <div className='py-3 px-3 font-bold'>Select All</div>
              </>
            )}
          </>
        </div>
        <div className='flex flex-col'>
          <div className='columns-5 gap-4'>
            {skills.map((skill) => (
              <div key={skill.id} className='flex hover:bg-slate-100'>
                <div className='py-2 px-2 '>
                  <Checkbox
                    checked={checkedUserSkills.map((skill) => skill.id).includes(skill.id)}
                    onChange={(checked) => handleClickCheckbox(checked, skill.id)}
                    disabled={user_skill_map_ratings.map((skill) => skill.id).includes(skill.id)}
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
