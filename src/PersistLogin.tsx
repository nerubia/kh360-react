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
const Sample = lazy(async () => await import("./pages/sample/sample"))

const AdminRoute = lazy(async () => await import("./routes/AdminRoute"))
const Evaluations = lazy(
  async () => await import("./pages/admin/evaluations/evaluations")
)
const CreateEvaluation = lazy(
  async () => await import("./pages/admin/evaluations/create/create_evaluation")
)
const ViewEvaluation = lazy(
  async () => await import("./pages/admin/evaluations/[id]/view_evaluation")
)
const EditEvaluation = lazy(
  async () =>
    await import("./pages/admin/evaluations/[id]/edit/edit_evaluation")
)
const SelectEmployees = lazy(
  async () =>
    await import("./pages/admin/evaluations/[id]/select/select_employees")
)
const PreviewEmployees = lazy(
  async () =>
    await import("./pages/admin/evaluations/[id]/preview/preview_employees")
)
const Evaluees = lazy(
  async () => await import("./pages/admin/evaluations/[id]/evaluees/evaluees")
)

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
          {
            path: "/sample",
            element: <Sample />,
          },
          {
            element: <AdminRoute />,
            children: [
              {
                path: "/admin/evaluations",
                element: <Evaluations />,
              },
              {
                path: "/admin/evaluations/create",
                element: <CreateEvaluation />,
              },
              {
                path: "/admin/evaluations/:id",
                element: <ViewEvaluation />,
              },
              {
                path: "/admin/evaluations/:id/edit",
                element: <EditEvaluation />,
              },
              {
                path: "/admin/evaluations/:id/select",
                element: <SelectEmployees />,
              },
              {
                path: "/admin/evaluations/:id/preview",
                element: <PreviewEmployees />,
              },
              {
                path: "/admin/evaluations/:id/evaluees",
                element: <Evaluees />,
              },
            ],
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
