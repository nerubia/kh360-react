import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Input } from "@components/ui/input/input"
import { Button } from "@components/ui/button/button"
import { useAppSelector } from "@hooks/useAppSelector"
import { getAllSkillCategories } from "@redux/slices/skill-categories-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { type Option } from "@custom-types/optionType"

export const SelectSkillsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const appDispatch = useAppDispatch()

  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const [category, setCategory] = useState<string>(searchParams.get("skill_category_id") ?? "all")
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([])

  const { skill_categories } = useAppSelector((state) => state.skillCategories)

  useEffect(() => {
    void appDispatch(getAllSkillCategories())
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

  useEffect(() => {
    if (category.length !== 0) {
      searchParams.set("skill_category_id", category)
    } else {
      searchParams.delete("skill_category_id", category)
    }
    searchParams.set("page", "1")
    setSearchParams(searchParams)
  }, [category])

  const handleSearch = async () => {
    if (name.length !== 0) {
      searchParams.set("name", name)
    } else {
      searchParams.delete("name")
    }
    searchParams.set("page", "1")
    setSearchParams(searchParams)
  }

  const handleClear = async () => {
    setName("")
    setCategory("all")
    setSearchParams({})
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col md:flex-row justify-between gap-4'>
        <div className='flex-1 flex flex-col md:flex-row gap-4'>
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
      <div className='flex flex-row gap-4 overflow-auto whitespace-nowrap'>
        {categoryOptions.map((categoryOption, index) => (
          <div key={index}>
            <div className='mb-4'>
              <Button
                fullWidth
                variant={categoryOption.value === category ? "primary" : "primaryOutline"}
                onClick={() => setCategory(categoryOption.value ?? "all")}
                size='small'
                fullHeight
              >
                {categoryOption.label}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
