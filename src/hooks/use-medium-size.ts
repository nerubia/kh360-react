import { useEffect, useState } from "react"

export const useMediumSize = () => {
  const [isMediumSize, setIsMediumSize] = useState<boolean>(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => {
      setIsMediumSize(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return isMediumSize
}
