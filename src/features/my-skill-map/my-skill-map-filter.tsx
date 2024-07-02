import { CustomSelect } from "@components/ui/select/custom-select"
import { type Option } from "@custom-types/optionType"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { setSelectedSkillMapAdminId } from "@redux/slices/user-slice"
import { convertToMonthAndYear } from "@utils/format-date"
import { useEffect, useState } from "react"

export const MySkillMapFilter = () => {
  const appDispatch = useAppDispatch()
  const { my_skill_map, selectedSkillMapAdminId } = useAppSelector((state) => state.user)
  const [filterOptions, setFilterOptions] = useState<Option[]>([])

  useEffect(() => {
    const options = my_skill_map.map((skillMap) => {
      return {
        label:
          `${convertToMonthAndYear(skillMap.skill_map_period_end_date ?? "")} - ${skillMap.name}` ??
          "",
        value: skillMap.id.toString(),
      }
    })
    options.unshift({
      label: "All",
      value: "all",
    })
    setFilterOptions(options)
  }, [my_skill_map])

  return (
    <div className='flex justify-end'>
      <CustomSelect
        data-test-id='SkillMapAdminFilter'
        label='Skill Map Admin'
        name='skill_map_admin'
        value={filterOptions.find((option) => option.value === selectedSkillMapAdminId.toString())}
        onChange={(option) => appDispatch(setSelectedSkillMapAdminId(option?.value))}
        options={filterOptions}
      />
    </div>
  )
}
