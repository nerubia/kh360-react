import type { GroupBase, OptionsOrGroups } from "react-select"
import { type Option } from "../../../types/optionType"

export const CustomSelectInfinite = async (
  search: string,
  prevOptions: OptionsOrGroups<Option, GroupBase<Option>>,
  evaluationAdministrationFilters: Option[],
  totalEvalItems: number,
  hasNextPage: boolean
) => {
  const options: Option[] = evaluationAdministrationFilters.map(({ value, label }) => ({
    value,
    label,
  }))

  let filteredOptions: Option[] = options

  if (search.length > 0) {
    const searchTerms = search.toLowerCase().split(/\s+/)

    filteredOptions = options.filter(({ label }) => {
      const labelLower = label.toLowerCase()
      return searchTerms.every((term) => labelLower.includes(term))
    })
  }

  const hasMore = totalEvalItems > 10 || hasNextPage
  const slicedOptions = filteredOptions.slice(prevOptions.length, prevOptions.length + 10)

  return {
    options: slicedOptions,
    hasMore,
  }
}
