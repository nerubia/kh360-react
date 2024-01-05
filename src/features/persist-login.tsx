import { Suspense, useEffect, useState } from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"

import { useAppDispatch } from "../hooks/useAppDispatch"
import { refreshToken } from "../redux/slices/auth-slice"

import { guestRoutes } from "../routes/guest-route"
import { authRoutes } from "../routes/auth-route"
import { privateRoutes } from "../routes/private-route"
import { otherRoutes } from "../routes/other-route"

const router = createBrowserRouter([guestRoutes, authRoutes, privateRoutes, otherRoutes])

export const PersistLogin = () => {
  const appDispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyRefreshToken = async () => {
      await appDispatch(refreshToken())
      setLoading(false)
    }
    void verifyRefreshToken()
  }, [])

  return loading ? null : (
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
