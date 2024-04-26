import { useEffect, useState } from "react"
import { Button } from "@components/ui/button/button"
import { Input } from "@components/ui/input/input"
import { CustomSelect } from "@components/ui/select/custom-select"
import { type Option } from "@custom-types/optionType"
import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { getUsers } from "@redux/slices/users-slice"

interface SelectUsersFilterProps {
  searchParamsKey: string
  defaultStatus?: string
}

const SelectUsersFilter = ({ searchParamsKey, defaultStatus = "all" }: SelectUsersFilterProps) => {
  const appDispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const [employee_type, setEmployeeType] = useState<string>(
    searchParams.get(searchParamsKey) ?? defaultStatus
  )

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
    searchParams.set(searchParamsKey, employee_type)
    searchParams.set("page", "1")
    setSearchParams(searchParams)
  }

  const handleClear = async () => {
    setName("")
    setEmployeeType(defaultStatus)
    setSearchParams({})
  }

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
          name='employee_type'
          value={filterOptions.find((option) => option.value === employee_type)}
          onChange={(option) => setEmployeeType(option !== null ? option.value : defaultStatus)}
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

export default SelectUsersFilter
