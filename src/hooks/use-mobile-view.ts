import { useEffect, useState } from "react"

export const useMobileView = () => {
  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return isMobileView
}
