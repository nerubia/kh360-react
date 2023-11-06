import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate("/auth/login")
  }, [])

  return <div className='bg-blue-500'>Home</div>
}
