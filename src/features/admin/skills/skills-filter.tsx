import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { type Option } from "@custom-types/optionType"

import { Input } from "@components/ui/input/input"
import { Button } from "@components/ui/button/button"
import { CustomSelect } from "@components/ui/select/custom-select"
import { SkillStatus } from "@custom-types/skill-type"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { getAllSkillCategories } from "@redux/slices/skill-categories-slice"

const statusOptions: Option[] = Object.values(SkillStatus).map((value) => ({
  label: value,
  value,
}))

statusOptions.unshift({
  label: "All",
  value: "all",
})

export const SkillsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [categoryOptions, setCategoryOptions] = useState<Option[]>([])
  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const [skillCategory, setSkillCategory] = useState<string>(
    searchParams.get("skill-category_id") ?? "all"
  )
  const [status, setStatus] = useState<string>(searchParams.get("status") ?? "all")

  const appDispatch = useAppDispatch()
  const { skill_categories } = useAppSelector((state) => state.skillCategories)

  useEffect(() => {
    void appDispatch(getAllSkillCategories({}))
  }, [])

  useEffect(() => {
    const filterOptions: Option[] = skill_categories.map((category) => ({
      label: category.name ?? "",
      value: category.id.toString() ?? "",
    }))
    filterOptions.unshift({
      label: "All",
      value: "all",
    })
    setCategoryOptions(filterOptions)
  }, [skill_categories])

  const handleSearch = async () => {
    if (name.length !== 0) {
      searchParams.set("name", name)
    } else {
      searchParams.delete("name")
    }
    if (skill_categories.length !== 0) {
      searchParams.set("skill_category_id", skillCategory)
    } else {
      searchParams.delete("skill_category_id")
    }
    if (status !== "all") {
      searchParams.set("status", status)
    } else {
      searchParams.delete("status")
    }
    searchParams.set("page", "1")
    setSearchParams(searchParams)
  }

  const handleClear = async () => {
    setName("")
    setStatus("all")
    setSkillCategory("all")
    setSearchParams({})
  }

  return (
    <div className='flex flex-col md:flex-row justify-between gap-4 flex-wrap'>
      <div className='flex-1 flex flex-col md:flex-row gap-4 flex-wrap'>
        <div className='flex-1'>
          <Input
            label='Name'
            name='searchName'
            placeholder='Search by name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='flex-1'>
          <CustomSelect
            data-test-id='CategoryFilter'
            label='Skill Category'
            name='skill_category'
            value={categoryOptions.find((option) => option.value === skillCategory)}
            onChange={(option) => setSkillCategory(option !== null ? option.value : "")}
            options={categoryOptions}
            fullWidth
          />
        </div>
        <div className='w-full lg:flex-1'>
          <CustomSelect
            data-test-id='StatusFilter'
            label='Status'
            name='status'
            value={statusOptions.find((option) => option.value === status)}
            onChange={(option) => setStatus(option !== null ? option.value : "")}
            options={statusOptions}
            fullWidth
          />
        </div>
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
