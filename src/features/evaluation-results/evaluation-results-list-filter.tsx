import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Input } from "../../components/ui/input/input"
import { CustomSelect } from "../../components/ui/select/custom-select"
import { Button } from "../../components/ui/button/button"
import { type Option } from "../../types/optionType"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { getEvaluationAdministrations } from "../../redux/slices/evaluation-administrations-slice"
import { useAppSelector } from "../../hooks/useAppSelector"
import { EvaluationAdministrationStatus } from "../../types/evaluation-administration-type"
import { getScoreRatings } from "../../redux/slices/score-ratings-slice"
import { Banding } from "../../types/banding-type"
import { useMobileView } from "../../hooks/use-mobile-view"
import { AsyncPaginate } from "react-select-async-paginate"
import { CustomSelectInfinite } from "../../components/ui/select/custom-select-infinite"

const bandingFilters: Option[] = Object.values(Banding).map((value) => ({
  label: value,
  value,
}))

bandingFilters.unshift({
  label: "All",
  value: "all",
})

const sortByFilters: Option[] = [
  {
    label: "Employee",
    value: "evaluee",
  },
  {
    label: "Score [Low to High]",
    value: "score_asc",
  },
  {
    label: "Score [High to Low]",
    value: "score_desc",
  },
  {
    label: "Standard Score [Low to High]",
    value: "standard_score_asc",
  },
  {
    label: "Standard Score [High to Low]",
    value: "standard_score_desc",
  },
]

export const EvaluationResultsListFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const { evaluation_administrations } = useAppSelector((state) => state.evaluationAdministrations)
  const { totalItems } = useAppSelector((state) => state.evaluationResults)
  const { score_ratings } = useAppSelector((state) => state.scoreRatings)

  const [evaluationAdministrationFilters, setEvaluationAdministrationFilters] = useState<Option[]>(
    []
  )
  const [scoreRatingFilters, setScoreRatingFilters] = useState<Option[]>([])

  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const [evaluationAdministrationId, setEvaluationAdministrationId] = useState<string>(
    searchParams.get("evaluation_administration_id") ?? "all"
  )
  const [scoreRatingId, setScoreRatingId] = useState<string>(
    searchParams.get("score_ratings_id") ?? "all"
  )
  const [banding, setBanding] = useState<string>(searchParams.get("banding") ?? "all")
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort_by") ?? "evaluee")
  const isMobile = useMobileView()
  const [page, setPage] = useState<string>("1")
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
  const [totalEvalItems, setTotalEvalItems] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await appDispatch(
          getEvaluationAdministrations({
            status: [
              EvaluationAdministrationStatus.Closed,
              EvaluationAdministrationStatus.Published,
            ].join(","),
            page,
          })
        )
        const pageInfo = response.payload.pageInfo
        if (pageInfo.hasNextPage === true) {
          const nextPage = String(Number(page) + 1)
          setPage(nextPage)
          setHasNextPage(true)
          setTotalEvalItems(pageInfo.totalItems)
        } else {
          setHasNextPage(false)
        }
      } catch (error) {}
    }
    void fetchData()
    void appDispatch(getScoreRatings())
  }, [appDispatch, page])

  useEffect(() => {
    const filterOptions: Option[] = evaluation_administrations.map((evalAdmin) => ({
      label: evalAdmin.name ?? "",
      value: evalAdmin.id.toString(),
    }))

    if (hasNextPage) {
      if (isInitialLoad) {
        filterOptions.unshift({
          label: "All",
          value: "all",
        })
        setIsInitialLoad(false)
      }
      setEvaluationAdministrationFilters((prevData) => [...prevData, ...filterOptions])
    }
  }, [evaluation_administrations])

  useEffect(() => {
    const filterOptions: Option[] = score_ratings.map((scoreRating) => ({
      label: scoreRating.display_name ?? "",
      value: scoreRating.id.toString(),
    }))
    filterOptions.unshift({
      label: "All",
      value: "all",
    })
    setScoreRatingFilters(filterOptions)
  }, [score_ratings])

  const handleSearch = async (sort?: string) => {
    if (name.length !== 0) {
      searchParams.set("name", name)
    } else {
      searchParams.delete("name")
    }
    searchParams.set("evaluation_administration_id", evaluationAdministrationId)
    searchParams.set("score_ratings_id", scoreRatingId)
    searchParams.set("banding", banding)
    searchParams.set("sort_by", sort ?? sortBy)
    searchParams.set("page", "1")
    setSearchParams(searchParams)
  }

  const handleClear = async () => {
    setName("")
    setEvaluationAdministrationId("all")
    setScoreRatingId("all")
    setBanding("all")
    setSortBy("all")
    setSearchParams({})
  }
  return (
    <div className='flex flex-col gap-2 md:gap-4'>
      <div className='flex flex-col md:flex-row gap-2 md:gap-4'>
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
          <div className='flex-1'>
            <label
              htmlFor='evaluation_administration'
              className={`whitespace-nowrap ${isMobile ? "text-sm" : "font-medium"}`}
            >
              Evaluation Administration
            </label>
            <AsyncPaginate
              data-test-id='EvaluationAdministration'
              name='evaluation_administration'
              placeholder='All'
              value={evaluationAdministrationFilters.find(
                (option) => option.value === evaluationAdministrationId
              )}
              loadOptions={async (search, prevOptions) =>
                await CustomSelectInfinite(
                  search,
                  prevOptions,
                  evaluationAdministrationFilters,
                  totalEvalItems,
                  hasNextPage
                )
              }
              onChange={(option) =>
                setEvaluationAdministrationId(option !== null ? option.value : "all")
              }
            />
          </div>
        </div>
        <div className='flex-1 flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <CustomSelect
              data-test-id='ScoreRating'
              label='Score Rating'
              name='score_rating'
              value={scoreRatingFilters.find((option) => option.value === scoreRatingId)}
              onChange={(option) => setScoreRatingId(option !== null ? option.value : "all")}
              options={scoreRatingFilters}
              fullWidth
            />
          </div>
          <div className='flex-1'>
            <CustomSelect
              data-test-id='Banding'
              label='Banding'
              name='banding'
              value={bandingFilters.find((option) => option.value === banding)}
              onChange={(option) => setBanding(option !== null ? option.value : "all")}
              options={bandingFilters}
              fullWidth
            />
          </div>
          <div className='flex-1'>
            <CustomSelect
              data-test-id='SortBy'
              label='Sort by'
              name='sort_by'
              value={sortByFilters.find((option) => option.value === sortBy)}
              onChange={(option) => {
                setSortBy(option !== null ? option.value : "evaluee")
                void handleSearch(option?.value)
              }}
              options={sortByFilters}
              fullWidth
            />
          </div>
        </div>
      </div>

      <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
        <h2 className='text-gray-400 text-sm md:text-lg'>
          {totalItems} {totalItems === 1 ? "Result" : "Results"} Found
        </h2>
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
    </div>
  )
}
