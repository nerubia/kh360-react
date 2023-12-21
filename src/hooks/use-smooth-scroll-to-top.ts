import { useEffect } from "react"

const useSmoothScrollToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
  useEffect(() => {
    const handleScrollToTop = () => {
      scrollToTop()
    }
    scrollToTop()
    window.addEventListener("scroll", handleScrollToTop)
    return () => {
      window.removeEventListener("scroll", handleScrollToTop)
    }
  }, [])

  return scrollToTop
}

export default useSmoothScrollToTop
