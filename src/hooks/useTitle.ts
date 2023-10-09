import { useEffect } from "react"

export const useTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | ${process.env.REACT_APP_NAME}`
  }, [title])
}
