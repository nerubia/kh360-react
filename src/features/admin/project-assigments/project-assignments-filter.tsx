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

  return (
    <div className='flex flex-col md:flex-row justify-between gap-4'>
      <div className='flex-1 flex flex-col md:flex-row gap-4'>
        <div className='flex-1'>
          <Input
            label='Name'
            name='name'
            placeholder='Search by name'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <Input
          label='Project'
          name='project'
          placeholder='Search by project'
          onChange={(e) => setProjectName(e.target.value)}
          value={project_name}
        />
        <CustomSelect
          label='Role'
          name='role'
          value={activeProjectRoles.find((option) => option.value === role)}
          onChange={(option) => setRole(option !== null ? option.value : "all")}
          options={activeProjectRoles}
        />
        <div className='flex flex-col sm:flex-row md:items-end justify-start gap-2'>
          <div className='w-full'>
            <Input
              label='Duration'
              name='start_date'
              type='date'
              placeholder='From'
              value={start_date}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <h2 className='font-medium mb-2'>to</h2>
          <div className='w-full'>
            <Input
              label=''
              name='end_date'
              type='date'
              placeholder='To'
              value={end_date}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
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
