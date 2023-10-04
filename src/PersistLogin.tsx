import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAppDispatch } from "./hooks/useAppDispatch"
import { refreshToken } from "./redux/slices/authSlice"

import { Layout } from "./components/layouts/Layout"
import { Home } from "./pages/home"

import { AuthRoute } from "./routes/AuthRoute"
import { Login } from "./pages/auth/login"
import { ForgotPassword } from "./pages/auth/forgot_password"
import { ResetPassword } from "./pages/auth/reset_password"

import { PrivateRoute } from "./routes/PrivateRoute"
import { Dashboard } from "./pages/dashboard/dashboard"

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    element: <AuthRoute />,
    children: [
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/forgot",
        element: <ForgotPassword />,
      },
      {
        path: "/auth/reset",
        element: <ResetPassword />,
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
])

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

  return loading ? null : <RouterProvider router={router} />
}
