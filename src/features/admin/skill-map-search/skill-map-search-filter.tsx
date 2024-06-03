import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Input } from "@components/ui/input/input"
import { CustomSelect } from "@components/ui/select/custom-select"
import { Button } from "@components/ui/button/button"
import { useAppSelector } from "@hooks/useAppSelector"

export const SkillMapSearchFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const [skill, setSkill] = useState<string>(searchParams.get("skill") ?? "all")
  const { skill_map_search } = useAppSelector((state) => state.skillMapSearch)

  const handleSearch = async () => {
    setSearchParams((prevParams) => {
      const params = new URLSearchParams(prevParams)
      if (name.length !== 0) {
        params.set("name", name)
      } else {
        params.delete("name")
      }
      params.set("skill", skill)
      params.set("page", "1")
      return params
    })
  }

  const handleClear = async () => {
    setName("")
    setSkill("all")
    setSearchParams({})
  }

  const skillNames = skill_map_search
    .flatMap((skill) => skill.skill_map_ratings?.map((rating) => rating.skills.name) ?? [])
    .map((name) => ({ label: name, value: name }))
  skillNames.unshift({
    label: "All",
    value: "all",
  })

  const selectedSkillOption = skillNames.find((option) => option.value === skill) ?? null

  return (
    <div className='flex flex-col md:flex-row justify-between gap-4 flex-wrap'>
      <div className='flex-1 flex flex-col md:flex-row gap-4'>
        <div className='flex-1'>
          <Input
            label='Name'
            name='search'
            placeholder='Search by name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <CustomSelect
          data-test-id='StatusFilter'
          label='Skill'
          name='skill'
          value={selectedSkillOption}
          onChange={(option) => setSkill(option !== null ? option.value : "all")}
          options={skillNames}
        />
      </div>
      <div className='flex items-end gap-4'>
        <Button onClick={handleSearch}>Search</Button>
        <Button variant='primaryOutline' onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  )
}
