import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Button } from "@components/ui/button/button"
import { useAppSelector } from "@hooks/useAppSelector"
import { getAllSkillCategories } from "@redux/slices/skill-categories-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { type Option } from "@custom-types/optionType"

export const SkillMapFormAction = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const appDispatch = useAppDispatch()

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
    setSearchParams(searchParams)
  }, [category])

  return (
    <div className='flex flex-col gap-4'>
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
