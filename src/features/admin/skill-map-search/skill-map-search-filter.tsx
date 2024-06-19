import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Input } from "@components/ui/input/input"
import { Button } from "@components/ui/button/button"
import { Menu, MenuButton, MenuItem, SubMenu } from "@szhsin/react-menu"
import "@szhsin/react-menu/dist/index.css"
import "@szhsin/react-menu/dist/transitions/slide.css"
import { useMobileView } from "@hooks/use-mobile-view"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { getAllSkillCategories } from "@redux/slices/skill-categories-slice"
import { useAppSelector } from "@hooks/useAppSelector"
import { type Option } from "@custom-types/optionType"
import { CustomSelect } from "@components/ui/select/custom-select"
import {
  SkillMapSearchSortNames,
  SkillMapSearchSortOptions,
} from "@custom-types/skill-map-search-type"

const sortOptions: Option[] = Object.values(SkillMapSearchSortOptions).map((value) => ({
  label: SkillMapSearchSortNames[value],
  value,
}))

export const SkillMapSearchFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const appDispatch = useAppDispatch()
  const { skill_categories } = useAppSelector((state) => state.skillCategories)

  const isMobile = useMobileView()

  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const [skill, setSkill] = useState<string>(searchParams.get("skill") ?? "All")
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sortBy") ?? "")

  const skillCategories = skill_categories.map((category) => category)
  skillCategories.unshift({
    id: 0,
    name: "All",
  })

  useEffect(() => {
    void appDispatch(
      getAllSkillCategories({
        includes: ["skills"],
      })
    )
  }, [])

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
      params.set("sortBy", sortBy)
      return params
    })
  }

  const handleClear = async () => {
    setName("")
    setSkill("All")
    setSortBy("")
    setSearchParams({})
  }

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
        <div className='w-80 flex flex-col'>
          <label className={`whitespace-nowrap ${isMobile ? "text-sm" : "font-medium"}`}>
            Skill
          </label>
          <Menu
            menuButton={
              <MenuButton className='text-start border px-4 py-1.5 rounded-md'>{skill}</MenuButton>
            }
            overflow='auto'
            position='anchor'
          >
            {skillCategories.map((category) =>
              category.skills === undefined ? (
                <MenuItem key={category.id} onClick={() => setSkill("All")}>
                  {category.name}
                </MenuItem>
              ) : (
                <SubMenu key={category.id} label={category.name} overflow='auto'>
                  {category.skills?.map((skill) => (
                    <MenuItem key={skill.id} onClick={() => setSkill(skill.name)}>
                      {skill.name}
                    </MenuItem>
                  ))}
                </SubMenu>
              )
            )}
          </Menu>
        </div>
        <CustomSelect
          data-test-id='SortFilter'
          label='Sort By'
          name='sort'
          value={sortOptions.find((option) => option.value === sortBy)}
          onChange={(option) => setSortBy(option !== null ? option.value : "")}
          options={sortOptions}
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
