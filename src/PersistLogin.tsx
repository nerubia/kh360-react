import { Suspense, lazy, useEffect, useState } from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { useAppDispatch } from "./hooks/useAppDispatch"
import { refreshToken } from "./redux/slices/authSlice"

const Layout = lazy(async () => await import("./components/layouts/Layout"))
const DashboardLayout = lazy(
  async () => await import("./components/layouts/DashboardLayout")
)

const Home = lazy(async () => await import("./pages/home"))
const AuthRoute = lazy(async () => await import("./routes/AuthRoute"))

const Login = lazy(async () => await import("./pages/auth/login"))
const ForgotPassword = lazy(
  async () => await import("./pages/auth/forgot_password")
)
const ResetPassword = lazy(
  async () => await import("./pages/auth/reset_password")
)

const PrivateRoute = lazy(async () => await import("./routes/PrivateRoute"))
const Dashboard = lazy(async () => await import("./pages/dashboard/dashboard"))

const NotFound = lazy(async () => await import("./pages/404"))

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
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
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

  return loading ? null : (
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
