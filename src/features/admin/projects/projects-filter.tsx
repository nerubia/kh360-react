import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Input } from "@components/ui/input/input"
import { Button } from "@components/ui/button/button"
import { type Option } from "@custom-types/optionType"
import { CustomSelect } from "@components/ui/select/custom-select"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { getAllProjectStatus } from "@redux/slices/projects-slice"
import { useAppSelector } from "@hooks/useAppSelector"

export const ProjectsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const appDispatch = useAppDispatch()

  const { project_statuses } = useAppSelector((state) => state.projects)

  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const [client, setClient] = useState<string>(searchParams.get("client") ?? "")
  const [skills, setSkills] = useState<string>(searchParams.get("skills") ?? "")
  const [status, setStatus] = useState<string>(searchParams.get("status") ?? "all")

  const [statuses, setStatuses] = useState<Option[]>([])

  useEffect(() => {
    void appDispatch(getAllProjectStatus())
  }, [])

  useEffect(() => {
    const filterOptions: Option[] = project_statuses.map((project) => ({
      label: project.status ?? "",
      value: project.status ?? "",
    }))
    filterOptions.unshift({
      label: "All",
      value: "all",
    })
    setStatuses(filterOptions)
  }, [project_statuses])

  const handleSearch = () => {
    if (name.length !== 0) {
      searchParams.set("name", name)
    } else {
      searchParams.delete("name")
    }
    if (client.length !== 0) {
      searchParams.set("client", client)
    } else {
      searchParams.delete("client")
    }
    if (skills.length !== 0) {
      searchParams.set("skills", skills)
    } else {
      searchParams.delete("skills")
    }
    if (status.length !== 0) {
      searchParams.set("status", status)
    } else {
      searchParams.delete("status")
    }
    searchParams.set("page", "1")
    setSearchParams(searchParams)
  }

  const handleClear = async () => {
    setName("")
    setClient("")
    setSkills("")
    setStatus("all")
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='flex-1'>
          <Input
            label='Client'
            name='client'
            placeholder='Search by client'
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
        </div>
        <div className='flex-1'>
          <Input
            label='Skills'
            name='skills'
            placeholder='Search by skills'
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>
        <div className='flex-1'>
          <CustomSelect
            data-test-id='Status'
            label='Status'
            name='status'
            value={statuses.find((option) => option.value === status)}
            onChange={(option) => setStatus(option !== null ? option.value : "all")}
            options={statuses}
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
