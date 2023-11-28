import { Button } from "../../../../../components/ui/button/button"
import { Input } from "../../../../../components/input/Input"
import { CustomSelect } from "../../../../../components/ui/select/custom-select"
import { type Option } from "../../../../../types/optionType"
import { useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAppDispatch } from "../../../../../hooks/useAppDispatch"
import { getUsers } from "../../../../../redux/slices/usersSlice"

const filterOptions: Option[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Probationary",
    value: "probationary",
  },
  {
    label: "Regular",
    value: "regular",
  },
  {
    label: "Intern",
    value: "intern",
  },
]

export const SelectEmployeesFilter = () => {
  const appDispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const [employee_type, setEmployeeType] = useState<string>(searchParams.get("status") ?? "all")

  useEffect(() => {
    void appDispatch(
      getUsers({
        name: searchParams.get("name") ?? undefined,
        user_type: searchParams.get("user_type") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const handleSearch = async () => {
    if (name.length !== 0) {
      searchParams.set("name", name)
    } else {
      searchParams.delete("name")
    }
    searchParams.set("user_type", employee_type)
    searchParams.set("page", "1")
    setSearchParams(searchParams)
  }

  const handleClear = async () => {
    setName("")
    setEmployeeType("all")
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
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <CustomSelect
          label='Employee Type'
          name='employee-type'
          value={filterOptions.find((option) => option.value === employee_type)}
          onChange={(option) => setEmployeeType(option !== null ? option.value : "all")}
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
