import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Input } from "@components/ui/input/input"
import { Button } from "@components/ui/button/button"
import { type Option } from "@custom-types/optionType"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { getSkillMapResults } from "@redux/slices/skill-map-results-slice"
import { useAppSelector } from "@hooks/useAppSelector"
import { Banding } from "@custom-types/banding-type"
import { useMobileView } from "@hooks/use-mobile-view"

const bandingFilters: Option[] = Object.values(Banding).map((value) => ({
  label: value,
  value,
}))

bandingFilters.unshift({
  label: "All",
  value: "all",
})

export const SkillMapResultsListFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const { totalItems } = useAppSelector((state) => state.skillMapResults)

  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const isMobile = useMobileView()
  const [page, setPage] = useState<string>("1")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await appDispatch(getSkillMapResults())
        const { pageInfo } = response.payload
        if (pageInfo.hasNextPage === true) {
          const nextPage = String(Number(page) + 1)
          setPage(nextPage)
        }
      } catch (error) {}
    }
    void fetchData()
  }, [page])

  const handleSearch = async () => {
    if (name.length !== 0) {
      searchParams.set("name", name)
    } else {
      searchParams.delete("name")
    }
    searchParams.set("page", "1")
    setSearchParams(searchParams)
  }

  const handleClear = async () => {
    setName("")
    setSearchParams({})
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
          <Button
            size={isMobile ? "small" : "medium"}
            onClick={() => {
              void handleSearch()
            }}
          >
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
