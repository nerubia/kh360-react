import { Button } from "@components/ui/button/button"
import { Input } from "@components/ui/input/input"
import { CustomSelect } from "@components/ui/select/custom-select"
import { type Option } from "@custom-types/optionType"
import { useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { searchProjectMembers } from "@redux/slices/project-members-slice"
import { useAppSelector } from "@hooks/useAppSelector"
import { getProjectRoles } from "@redux/slices/project-roles-slice"
import { DateRangePicker } from "@components/ui/date-range-picker/date-range-picker"
import { type DateValueType } from "react-tailwindcss-datepicker"

export const ProjectAssignmentsFilter = () => {
  const appDispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const [project_name, setProjectName] = useState<string>(searchParams.get("project_name") ?? "")
  const [role, setRole] = useState<string>(searchParams.get("role") ?? "all")
  const [start_date, setStartDate] = useState<string>(searchParams.get("start_date") ?? "")
  const [end_date, setEndDate] = useState<string>(searchParams.get("end_date") ?? "")
  const { project_roles } = useAppSelector((state) => state.projectRoles)
  const [activeProjectRoles, setActiveProjectRoles] = useState<Option[]>([])

  useEffect(() => {
    void appDispatch(getProjectRoles())
  }, [])

  useEffect(() => {
    void appDispatch(
      searchProjectMembers({
        name: searchParams.get("name") ?? undefined,
        project_name: searchParams.get("project_name") ?? undefined,
        start_date: searchParams.get("start_date") ?? undefined,
        end_date: searchParams.get("end_date") ?? undefined,
        role: searchParams.get("role") ?? undefined,
      })
    )
  }, [searchParams])

  useEffect(() => {
    const options: Option[] = project_roles.map((projectRole) => ({
      label: `${projectRole?.name}`,
      value: projectRole.id.toString(),
    }))
    options.unshift({
      label: "All",
      value: "all",
    })
    setActiveProjectRoles(options)
  }, [project_roles])

  const handleSearch = async () => {
    if (name.length !== 0) {
      searchParams.set("name", name)
    } else {
      searchParams.delete("name")
    }
    if (project_name.length !== 0) {
      searchParams.set("project_name", project_name)
    } else {
      searchParams.delete("project_name")
    }
    if (start_date.length !== 0) {
      searchParams.set("start_date", start_date)
    } else {
      searchParams.delete("start_date")
    }
    if (end_date.length !== 0) {
      searchParams.set("end_date", end_date)
    } else {
      searchParams.delete("end_date")
    }
    searchParams.set("role", role)
    setSearchParams(searchParams)
  }

  const handleClear = async () => {
    setName("")
    setRole("all")
    setProjectName("")
    setStartDate("")
    setEndDate("")
    setSearchParams({})
  }

  const handleDateRangeChange = (
    value: DateValueType,
    _e?: HTMLInputElement | null | undefined
  ) => {
    setStartDate(value?.startDate?.toString().split("T")[0] ?? "")
    setEndDate(value?.endDate?.toString().split("T")[0] ?? "")
  }

  return (
    <div className='flex flex-col md:flex-row justify-between gap-4 flex-wrap px-1'>
      <div className='flex-1 flex flex-col md:flex-row gap-4 flex-wrap'>
        <div className='flex-1'>
          <Input
            label='Name'
            name='name'
            placeholder='Search by name'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <div className='flex-1'>
          <Input
            label='Project'
            name='project'
            placeholder='Search by project'
            onChange={(e) => setProjectName(e.target.value)}
            value={project_name}
          />
        </div>
        <div className='w-full lg:w-1/4'>
          <CustomSelect
            label='Role'
            name='role'
            value={activeProjectRoles.find((option) => option.value === role)}
            onChange={(option) => setRole(option !== null ? option.value : "all")}
            options={activeProjectRoles}
            fullWidth
          />
        </div>
        <div className='flex w-full gap-2 justify-between'>
          <div className='w-9/25'>
            <DateRangePicker
              name='duration'
              label='Duration'
              value={{ startDate: start_date, endDate: end_date }}
              onChange={handleDateRangeChange}
            />
          </div>
          <div className='flex items-end gap-4 mb-1'>
            <Button onClick={handleSearch}>Search</Button>
            <Button variant='primaryOutline' onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
