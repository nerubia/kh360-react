import { format, utcToZonedTime } from "date-fns-tz"
import { type User } from "@custom-types/user-type"

export const formatDate = (date?: string) => {
  return date?.split("T")[0]
}

export const shortenFormatDate = (dateString?: string): string => {
  if (dateString == null) {
    return "Invalid date"
  }
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return "Invalid date"
  }
  const targetTimeZone = "UTC"
  const convertedDate = utcToZonedTime(date, targetTimeZone)
  return format(convertedDate, "MMM d, yyyy", { timeZone: targetTimeZone })
}

export const convertToFullDate = (date: string) => {
  if (date.length === 0) {
    return "Date not found"
  }
  const inputDate = new Date(date)
  const utcDate = utcToZonedTime(inputDate, "UTC")
  return format(utcDate, "MMMM d, yyyy", { timeZone: "UTC" })
}

export const convertToFullDateAndTime = (date?: string, user?: User | null) => {
  let targetTimeZone = "UTC"
  if (user?.user_settings != null) {
    for (const userSettings of user?.user_settings) {
      if (userSettings.name === "timezone") {
        targetTimeZone = userSettings.setting ?? "+08:00"
      }
    }
  }
  const inputDate = new Date(date ?? "")
  const convertedDate = utcToZonedTime(inputDate, targetTimeZone)
  return format(convertedDate, "MMMM d, yyyy 'at' hh:mm:ss a", { timeZone: targetTimeZone })
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
