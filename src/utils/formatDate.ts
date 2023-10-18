import moment from "moment"

export const formatDate = (date: string | undefined) => {
  return moment(date).format("YYYY-MM-DD")
}
