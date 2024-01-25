import { useEffect, useState } from "react"

export const useMobileView = (customThreshold?: number) => {
  const threshold = customThreshold ?? 768
  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < threshold)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < threshold)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [threshold])

  return isMobileView
}
