import { useEffect, useState } from "react"

const useEnterKeyListener = (callback: () => void) => {
  const [keyPressed, setKeyPressed] = useState<boolean>(false)

  useEffect(() => {
    const handleKeyPress = async (e: KeyboardEvent) => {
      if (e.key === "Enter" && !keyPressed) {
        setKeyPressed(true)
        callback()
      }
    }

    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [keyPressed, callback])

  return setKeyPressed
}

export default useEnterKeyListener
