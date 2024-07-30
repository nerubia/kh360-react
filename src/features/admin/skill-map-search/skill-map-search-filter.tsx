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
import { sortSkillCategoriesBySequenceNumber, sortSkillsByName } from "@utils/sort"
import { type Skill } from "@custom-types/skill-type"

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
  const [status, setStatus] = useState<string>(searchParams.get("status") ?? "Active")

  const skillCategories = sortSkillCategoriesBySequenceNumber(
    skill_categories.map((category) => {
      const skills: Skill[] = category.skills !== undefined ? [...category.skills] : []
      return {
        ...category,
        skills: sortSkillsByName(skills),
      }
    })
  )
  skillCategories.unshift({
    id: 0,
    name: "All",
  })

  const statusOptions: Option[] = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
    { label: "All", value: "All" },
  ]

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
      params.set("status", status)
      params.set("page", "1")
      if (sortBy.length !== 0) {
        params.set("sortBy", sortBy)
      } else {
        params.delete("sortBy")
      }
      return params
    })
  }
  const handleClear = async () => {
    setName("")
    setSkill("All")
    setSortBy("")
    setStatus("Active")
    setSearchParams({})
  }
  return (
    <div className='flex flex-col md:flex-row justify-between gap-4 flex-wrap'>
      <div className='flex-1 flex flex-col md:flex-row gap-4 flex-wrap'>
        <div className='w-80'>
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
          label='Employee Status'
          name='status'
          value={statusOptions.find((option) => option.value === status)}
          onChange={(option) => setStatus(option !== null ? option.value : "")}
          options={statusOptions}
        />
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

        <div className='flex items-end gap-4'>
          <Button onClick={handleSearch}>Search</Button>
          <Button variant='primaryOutline' onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}
