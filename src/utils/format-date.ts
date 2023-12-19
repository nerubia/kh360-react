import { format, utcToZonedTime } from "date-fns-tz"

export const formatDate = (date?: string) => {
  return date?.split("T")[0]
}

export const convertToFullDate = (date?: string) => {
  const inputDate = new Date(date ?? "")
  const utcDate = utcToZonedTime(inputDate, "UTC")
  return format(utcDate, "MMMM d, yyyy", { timeZone: "UTC" })
}

export const convertToFullDateAndTime = (date?: string) => {
  const inputDate = new Date(date ?? "")
  const utcDate = utcToZonedTime(inputDate, "UTC")
  return format(utcDate, "MMMM d, yyyy 'at' HH:mm:ss a", { timeZone: "UTC" })
}

export const formatDateRange = (start_date?: string | Date, end_date?: string | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }
  const monthAndDateOnly: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }

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
    startDate.getUTCMonth() === endDate.getUTCMonth() &&
    startDate.getUTCFullYear() === endDate.getUTCFullYear()
  ) {
    formattedDate += ` - ${endDate.getUTCDate()}, ${endDate.getUTCFullYear()}`
  } else if (startDate.getUTCFullYear() === endDate.getUTCFullYear()) {
    formattedDate += ` - ${endDate.toLocaleDateString("en-US", options)}`
  } else {
    formattedDate = `${startDate.toLocaleDateString(
      "en-US",
      options
    )} - ${endDate.toLocaleDateString("en-US", options)}`
  }

  return formattedDate
}
