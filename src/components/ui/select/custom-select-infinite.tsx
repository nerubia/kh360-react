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
