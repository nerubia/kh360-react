import moment from "moment"

export const formatDate = (date?: string) => {
  return date !== null && moment(date).format("YYYY-MM-DD")
}
