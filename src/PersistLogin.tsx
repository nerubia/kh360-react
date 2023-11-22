import { Suspense, lazy, useEffect, useState } from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { useAppDispatch } from "./hooks/useAppDispatch"
import { refreshToken } from "./redux/slices/authSlice"

const Layout = lazy(async () => await import("./components/layouts/Layout"))
const DashboardLayout = lazy(async () => await import("./components/layouts/DashboardLayout"))

const Home = lazy(async () => await import("./pages/home"))
const AuthRoute = lazy(async () => await import("./routes/AuthRoute"))

const Login = lazy(async () => await import("./pages/auth/login"))
const ForgotPassword = lazy(async () => await import("./pages/auth/forgot_password"))
const ResetPassword = lazy(async () => await import("./pages/auth/reset_password"))

const PrivateRoute = lazy(async () => await import("./routes/PrivateRoute"))
const Dashboard = lazy(async () => await import("./pages/dashboard/dashboard"))
const Sample = lazy(async () => await import("./pages/sample/sample"))

const UserEvaluationAdministrations = lazy(
  async () => await import("./pages/evaluations/user-evaluation-administrations")
)
const Evaluations = lazy(async () => await import("./pages/evaluations/[id]/evaluations"))

const AdminRoute = lazy(async () => await import("./routes/AdminRoute"))

const EvaluationAdministrations = lazy(
  async () => await import("./pages/admin/evaluation-administrations/evaluation-administrations")
)
const CreateEvaluation = lazy(
  async () => await import("./pages/admin/evaluation-administrations/create/create_evaluation")
)
const ViewEvaluation = lazy(
  async () => await import("./pages/admin/evaluation-administrations/[id]/view_evaluation")
)
const EditEvaluation = lazy(
  async () => await import("./pages/admin/evaluation-administrations/[id]/edit/edit_evaluation")
)
const SelectEmployees = lazy(
  async () => await import("./pages/admin/evaluation-administrations/[id]/select/select_employees")
)
const PreviewEmployees = lazy(
  async () =>
    await import("./pages/admin/evaluation-administrations/[id]/preview/preview_employees")
)
const Evaluees = lazy(
  async () => await import("./pages/admin/evaluation-administrations/[id]/evaluees/evaluees")
)
const Evaluators = lazy(
  async () =>
    await import(
      "./pages/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/evaluators"
    )
)
const ExternalEvaluators = lazy(
  async () => await import("./pages/admin/external-evaluators/external-evaluators")
)

const CreateExternalEvaluator = lazy(
  async () => await import("./pages/admin/external-evaluators/create/create-external-evaluator")
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
            path: "/evaluation-administrations/",
            element: <UserEvaluationAdministrations />,
          },
          {
            path: "/evaluation-administrations/:id/evaluations/:evaluation_id",
            element: <Evaluations />,
          },
          {
            element: <AdminRoute />,
            children: [
              /**
               * Evaluation Administrations
               */
              {
                path: "/admin/evaluation-administrations",
                element: <EvaluationAdministrations />,
              },
              {
                path: "/admin/evaluation-administrations/create",
                element: <CreateEvaluation />,
              },
              {
                path: "/admin/evaluation-administrations/:id",
                element: <ViewEvaluation />,
              },
              {
                path: "/admin/evaluation-administrations/:id/edit",
                element: <EditEvaluation />,
              },
              {
                path: "/admin/evaluation-administrations/:id/select",
                element: <SelectEmployees />,
              },
              {
                path: "/admin/evaluation-administrations/:id/preview",
                element: <PreviewEmployees />,
              },
              {
                path: "/admin/evaluation-administrations/:id/evaluees",
                element: <Evaluees />,
              },
              {
                path: "/admin/evaluation-administrations/:id/evaluees/:evaluation_result_id/evaluators/:evaluation_template_id",
                element: <Evaluators />,
              },
              /**
               * External Evaluators
               */
              {
                path: "/admin/external-evaluators",
                element: <ExternalEvaluators />,
              },
              {
                path: "/admin/external-evaluators/create",
                element: <CreateExternalEvaluator />,
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
