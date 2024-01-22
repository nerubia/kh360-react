import type { GroupBase, OptionsOrGroups } from "react-select"
import { type Option } from "../../../types/optionType"

const sleep = async (ms: number, loading: boolean) =>
  await new Promise((resolve) => {
    setTimeout(
      () => {
        resolve(undefined)
      },
      loading ? ms * 2 : ms
    )
  })

export const CustomSelectInfinite = async (
  search: string,
  prevOptions: OptionsOrGroups<Option, GroupBase<Option>>,
  evaluationAdministrationFilters: Option[],
  loading: boolean,
  totalEvalItems: number,
  hasNextPage: boolean
) => {
  const options: Option[] = evaluationAdministrationFilters.map(({ value, label }) => ({
    value,
    label,
  }))

  await sleep(1, loading)

  let filteredOptions: Option[]
  if (search.length === 0) {
    filteredOptions = options
  } else {
    const searchLower = search.toLowerCase()
    filteredOptions = options.filter(({ label }) => label.toLowerCase().includes(searchLower))
  }

  const hasMore = totalEvalItems > 10 || hasNextPage

  const slicedOptions = filteredOptions.slice(prevOptions.length, prevOptions.length + 10)

  return {
    options: slicedOptions,
    hasMore,
  }
}
