import { NavLink } from "react-router-dom"

export default function Home() {
  return (
    <div className='bg-blue-500'>
      <NavLink to='/auth/login'>Login</NavLink>
    </div>
  )
}
