import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Input } from "../../../components/input/Input"
import { Button } from "../../../components/button/Button"

export const ExternalEvaluatorsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const [company, setCompany] = useState<string>(searchParams.get("company") ?? "")
  const [role, setRole] = useState<string>(searchParams.get("role") ?? "")

  const handleSearch = async () => {
    if (name.length !== 0 || company.length !== 0 || role.length !== 0) {
      searchParams.set("name", name)
      searchParams.set("company", company)
      searchParams.set("role", role)
    } else {
      searchParams.delete("name")
      searchParams.delete("company", company)
      searchParams.delete("role", role)
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
        <Input
          label='Company'
          name='search'
          placeholder='Search by company'
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <Input
          label='Role'
          name='search'
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
  )
}
