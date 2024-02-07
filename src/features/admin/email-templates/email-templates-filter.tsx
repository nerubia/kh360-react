import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { type Option } from "@custom-types/optionType"

import { Input } from "@components/ui/input/input"
import { Button } from "@components/ui/button/button"
import { CustomSelect } from "@components/ui/select/custom-select"
import { EmailTemplateDefault } from "@custom-types/email-template-type"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { getTemplateTypes } from "@redux/slices/email-template-slice"

const defaultOptions: Option[] = Object.values(EmailTemplateDefault).map((value) => ({
  label: value,
  value,
}))

defaultOptions.unshift({
  label: "All",
  value: "all",
})

export const EmailTemplatesFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [template_types, setTemplateTypes] = useState<Option[]>([])
  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const [template_type, setTemplateType] = useState<string>(
    searchParams.get("template_type") ?? "all"
  )
  const [is_default, setDefault] = useState<string>(searchParams.get("default") ?? "all")

  const appDispatch = useAppDispatch()
  const { templateTypes } = useAppSelector((state) => state.emailTemplate)

  useEffect(() => {
    void appDispatch(getTemplateTypes())
  }, [])

  useEffect(() => {
    const filterOptions: Option[] = templateTypes.map((templateType) => ({
      label: templateType.label ?? "",
      value: templateType.value ?? "",
    }))
    filterOptions.unshift({
      label: "All",
      value: "all",
    })
    setTemplateTypes(filterOptions)
  }, [templateTypes])

  const handleSearch = async () => {
    if (name.length !== 0) {
      searchParams.set("name", name)
    } else {
      searchParams.delete("name")
    }
    if (template_type.length !== 0) {
      searchParams.set("template_type", template_type)
    } else {
      searchParams.delete("template_type")
    }
    if (is_default !== "all") {
      searchParams.set("is_default", is_default === "Yes" ? "true" : "false")
    } else {
      searchParams.delete("is_default")
    }
    searchParams.set("page", "1")
    setSearchParams(searchParams)
  }

  const handleClear = async () => {
    setName("")
    setTemplateType("all")
    setDefault("all")
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
            data-test-id='TemplateTypeFilter'
            label='Template Type'
            name='template_type'
            value={template_types.find((option) => option.value === template_type)}
            onChange={(option) => setTemplateType(option !== null ? option.value : "")}
            options={template_types}
            fullWidth
          />
        </div>
        <div className='w-full lg:flex-1'>
          <CustomSelect
            data-test-id='DefaultFilter'
            label='Default'
            name='is_default'
            value={defaultOptions.find((option) => option.value === is_default)}
            onChange={(option) => setDefault(option !== null ? option.value : "")}
            options={defaultOptions}
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
