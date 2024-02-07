import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Input } from "@components/ui/input/input"
import { Button } from "@components/ui/button/button"

export const ExternalEvaluatorsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const [company, setCompany] = useState<string>(searchParams.get("company") ?? "")
  const [role, setRole] = useState<string>(searchParams.get("role") ?? "")

  const handleSearch = async () => {
    if (name.length !== 0) {
      searchParams.set("name", name)
    } else {
      searchParams.delete("name")
    }
    if (company.length !== 0) {
      searchParams.set("company", company)
    } else {
      searchParams.delete("company")
    }
    if (role.length !== 0) {
      searchParams.set("role", role)
    } else {
      searchParams.delete("role")
    }
    searchParams.set("page", "1")
    setSearchParams(searchParams)
  }

  const handleClear = async () => {
    setName("")
    setCompany("")
    setRole("")
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
        <div className='w-full lg:w-1/4'>
          <Input
            label='Company'
            name='searchCompany'
            placeholder='Search by company'
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div className='w-full lg:w-1/4'>
          <Input
            label='Role'
            name='searchRole'
            placeholder='Search by role'
            value={role}
            onChange={(e) => setRole(e.target.value)}
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
