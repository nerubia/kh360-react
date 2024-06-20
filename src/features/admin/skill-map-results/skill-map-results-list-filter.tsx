import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Input } from "@components/ui/input/input"
import { Button } from "@components/ui/button/button"
import { useMobileView } from "@hooks/use-mobile-view"
import { updateFilteredSkillMapResults } from "@redux/slices/user-slice" // Import the action creator
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"

export const SkillMapResultsListFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const dispatch = useAppDispatch()

  const { totalItems } = useAppSelector((state) => state.skillMapResults)
  const { user_latest_skill_map_result } = useAppSelector((state) => state.user)

  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const isMobile = useMobileView()

  const handleSearch = async () => {
    let filteredResults: typeof user_latest_skill_map_result = []

    if (name.length !== 0) {
      filteredResults = user_latest_skill_map_result.filter((result) =>
        result.users.first_name.toLowerCase().includes(name.toLowerCase())
      )
      searchParams.set("name", name)
    } else {
      searchParams.delete("name")
    }

    searchParams.set("page", "1")
    setSearchParams(searchParams)

    dispatch(updateFilteredSkillMapResults(filteredResults))
  }

  const handleClear = async () => {
    setName("")
    setSearchParams({})
    dispatch(updateFilteredSkillMapResults([]))
  }

  return (
    <>
      <div className='flex flex-col md:flex-row justify-between gap-4 flex-wrap'>
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
        </div>

        <div className='flex items-end gap-4'>
          <Button size={isMobile ? "small" : "medium"} onClick={handleSearch}>
            Search
          </Button>
          <Button
            size={isMobile ? "small" : "medium"}
            variant='primaryOutline'
            onClick={handleClear}
          >
            Clear
          </Button>
        </div>
      </div>
      <h2 className='text-gray-400 text-sm md:text-lg'>
        {totalItems} {totalItems === 1 ? "Result" : "Results"} Found
      </h2>
    </>
  )
}
