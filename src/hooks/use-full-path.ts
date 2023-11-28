import { useLocation } from "react-router-dom"

export const useFullPath = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  return `${location.pathname}?${queryParams.toString()}`
}
