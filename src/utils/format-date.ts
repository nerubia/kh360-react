import { format } from "date-fns"

export const formatDate = (date?: string) => {
  return date?.split("T")[0]
}

export const convertToFullDate = (date?: string) => {
  return format(new Date(date ?? ""), "MMMM d, yyyy")
}

export const formatDateRange = (start_date?: string, end_date?: string) => {
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }
  const monthAndDateOnly: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }

  if (
    start_date === undefined ||
    end_date === undefined ||
    start_date === null ||
    end_date === null ||
    start_date === "" ||
    end_date === ""
  ) {
    return ""
  }

  const startDate = new Date(start_date)
  const endDate = new Date(end_date)

  let formattedDate = startDate.toLocaleDateString("en-US", monthAndDateOnly)

  if (
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    formattedDate += ` - ${endDate.getDate()}, ${endDate.getFullYear()}`
  } else if (startDate.getFullYear() === endDate.getFullYear()) {
    formattedDate += ` - ${endDate.toLocaleDateString("en-US", options)}`
  } else {
    formattedDate = `${startDate.toLocaleDateString(
      "en-US",
      options
    )} - ${endDate.toLocaleDateString("en-US", options)}`
  }

  return formattedDate
}
