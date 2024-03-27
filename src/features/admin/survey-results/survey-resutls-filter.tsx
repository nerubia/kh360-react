import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Button } from "@components/ui/button/button"
import { CustomSelect } from "@components/ui/select/custom-select"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { getAllSurveyAdministrations } from "@redux/slices/survey-administrations-slice"
import {
  SurveyAdministrationStatus,
  type SurveyAdminstration,
} from "@custom-types/survey-administration-type"

interface OptionType {
  label: string
  value: string
}

export const SurveyResultsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedName, setSelectedName] = useState<string>(searchParams.get("name") ?? "")
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get("status") ?? "all")
  const appDispatch = useAppDispatch()
  const [surveyAdminOption, setSurveyAdminOption] = useState<SurveyAdminstration[] | undefined>()

  useEffect(() => {
    const fetchData = async () => {
      const surAdminResponse = await appDispatch(
        getAllSurveyAdministrations({
          name: searchParams.get("name") ?? undefined,
          status: searchParams.get("status") ?? undefined,
          page: searchParams.get("page") ?? undefined,
        })
      )
      const surAdmin = surAdminResponse.payload as SurveyAdminstration[]
      setSurveyAdminOption(surAdmin)
    }

    void fetchData()
  }, [])

  useEffect(() => {
    void appDispatch(
      getAllSurveyAdministrations({
        name: searchParams.get("name") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const surveyNamesOptions: OptionType[] = Array.from(
    new Set(
      surveyAdminOption
        ?.filter((survey) => survey.status === SurveyAdministrationStatus.Closed)
        .map((survey) => survey.name)
    )
  )
    .filter((name) => typeof name === "string" && name.trim().length > 0)
    .map((name) => ({ label: name ?? "", value: name ?? "" }))

  const handleSearch = async () => {
    setSearchParams((prevSearchParams) => {
      const newSearchParams = new URLSearchParams(prevSearchParams)
      newSearchParams.set("name", selectedName)
      newSearchParams.set("status", selectedStatus)
      newSearchParams.set("page", "1")
      return newSearchParams
    })
  }

  const handleClear = async () => {
    setSelectedName("")
    setSelectedStatus("all")
    setSearchParams({})
  }

  return (
    <div className='flex flex-col md:flex-row justify-between gap-4 flex-wrap'>
      <div className='flex flex-col gap-4 w-1/2'>
        <div className='flex-1'>
          <CustomSelect
            label='Name'
            name='name'
            value={{
              label: selectedName !== "" ? selectedName : "All",
              value: selectedName !== "" ? selectedName : "",
            }}
            onChange={(option) => setSelectedName(option !== null ? option.value : "")}
            options={[{ label: "All", value: "" }, ...surveyNamesOptions]}
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
