import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Input } from "../../../../../components/input/Input"
import { CustomSelect } from "../../../../../components/select/CustomSelect"
import { Button } from "../../../../../components/ui/button/button"
import { type Option } from "../../../../../types/optionType"
import { EvaluationResultStatus } from "../../../../../types/evaluation-result-type"

const filterOptions: Option[] = Object.values(EvaluationResultStatus).map((value) => ({
  label: value,
  value,
}))

filterOptions.unshift({
  label: "All",
  value: "all",
})

export const EvalueesFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const [status, setStatus] = useState<string>(searchParams.get("status") ?? "all")

  const handleSearch = async () => {
    if (name.length !== 0) {
      searchParams.set("name", name)
    } else {
      searchParams.delete("name")
    }
    searchParams.set("status", status)
    searchParams.set("page", "1")
    setSearchParams(searchParams)
  }

  const handleClear = async () => {
    setName("")
    setStatus("all")
    setSearchParams({})
  }

  return (
    <div className='flex flex-col md:flex-row justify-between gap-4'>
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
          label='Review Status'
          name='status'
          value={filterOptions.find((option) => option.value === status)}
          onChange={(option) => setStatus(option !== null ? option.value : "all")}
          options={filterOptions}
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
