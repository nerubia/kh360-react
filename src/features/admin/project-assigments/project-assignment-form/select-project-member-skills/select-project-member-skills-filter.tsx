import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Input } from "@components/ui/input/input"
import { Button } from "@components/ui/button/button"
import { CustomSelect } from "@components/ui/select/custom-select"
import { useAppSelector } from "@hooks/useAppSelector"
import { getSkillCategories } from "@redux/slices/skill-category-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { type Option } from "@custom-types/optionType"

export const SelectProjectMemberSkillsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const appDispatch = useAppDispatch()

  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const [category, setCategory] = useState<string>(searchParams.get("skill_category_id") ?? "all")
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([])

  const { skill_categories } = useAppSelector((state) => state.skillCategories)

  useEffect(() => {
    void appDispatch(getSkillCategories())
  }, [])

  useEffect(() => {
    const options: Option[] = skill_categories.map((category) => ({
      label: category.name ?? "",
      value: category.id.toString(),
    }))
    options.unshift({
      label: "All",
      value: "all",
    })
    setCategoryOptions(options)
  }, [skill_categories])

  const handleSearch = async () => {
    if (name.length !== 0 || category.length !== 0) {
      searchParams.set("name", name)
      searchParams.set("skill_category_id", category)
    } else {
      searchParams.delete("name")
      searchParams.delete("skill_category_id", category)
    }
    searchParams.set("page", "1")
    setSearchParams(searchParams)
  }

  const handleClear = async () => {
    setName("")
    setCategory("all")
  }

  return (
    <div className='flex flex-col md:flex-row justify-between gap-4'>
      <div className='flex-1 flex flex-col md:flex-row gap-4'>
        <div className='w-9/20'>
          <CustomSelect
            data-test-id='searchCategory'
            label='Category'
            name='searchCategory'
            value={categoryOptions.find((option) => option.value === category)}
            onChange={(option) => setCategory(option !== null ? option.value : "all")}
            options={categoryOptions}
            fullWidth
          />
        </div>
        <div className='flex-1'>
          <Input
            label='Name'
            name='searchName'
            placeholder='Search by name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
