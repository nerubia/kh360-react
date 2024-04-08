import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { type Option } from "@custom-types/optionType"

import { Input } from "@components/ui/input/input"
import { Button } from "@components/ui/button/button"
import { CustomSelect } from "@components/ui/select/custom-select"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { getTemplateTypes } from "@redux/slices/email-template-slice"
import { SkillCategoryStatus } from "@custom-types/skill-category-type"

const defaultOptions: Option[] = Object.values(SkillCategoryStatus).map((value) => ({
  label: value,
  value,
}))

defaultOptions.unshift({
  label: "All",
  value: "all",
})

export const SkillCategoriesFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const [status, setStatus] = useState<string>(searchParams.get("status") ?? "all")

  const appDispatch = useAppDispatch()

  useEffect(() => {
    void appDispatch(getTemplateTypes())
  }, [])

  const handleSearch = async () => {
    if (name.length !== 0) {
      searchParams.set("name", name)
    } else {
      searchParams.delete("name")
    }
    if (status !== "all") {
      searchParams.set("status", status === "Active" ? "Active" : "Inactive")
    } else {
      searchParams.delete("status")
    }
    searchParams.set("page", "1")
    setSearchParams(searchParams)
  }

  const handleClear = async () => {
    setName("")
    setStatus("all")
    setSearchParams({})
  }

  return (
    <div className='flex flex-col md:flex-row justify-between gap-4 flex-wrap'>
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
        <div className='w-1/5'>
          <CustomSelect
            data-test-id='StatusFilter'
            label='Status'
            name='status'
            value={defaultOptions.find((option) => option.value === status)}
            onChange={(option) => setStatus(option !== null ? option.value : "all")}
            options={defaultOptions}
            fullWidth
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
