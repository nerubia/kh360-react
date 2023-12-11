import { Suspense, lazy, useEffect, useState } from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { useAppDispatch } from "./hooks/useAppDispatch"
import { refreshToken } from "./redux/slices/auth-slice"

const Layout = lazy(async () => await import("./components/layouts/Layout"))
const DashboardLayout = lazy(async () => await import("./components/layouts/DashboardLayout"))

const Home = lazy(async () => await import("./pages/home"))
const ExternalEvaluations = lazy(
  async () => await import("./pages/external-evaluations/external-evaluations")
)

const AuthRoute = lazy(async () => await import("./routes/AuthRoute"))
const Login = lazy(async () => await import("./pages/auth/login"))
const ForgotPassword = lazy(async () => await import("./pages/auth/forgot_password"))
const ResetPassword = lazy(async () => await import("./pages/auth/reset_password"))

const PrivateRoute = lazy(async () => await import("./routes/PrivateRoute"))

const InternalUserRoute = lazy(async () => await import("./routes/InternalUserRoute"))

/* const Dashboard = lazy(async () => await import("./pages/dashboard/dashboard"))
const Sample = lazy(async () => await import("./pages/sample/sample")) */

const MyEvaluations = lazy(async () => await import("./pages/my-evaluations/my-evaluations"))
const MyEvaluationResults = lazy(
  async () => await import("./pages/my-evaluations/[id]/my-evaluation-results")
)
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
  async () => await import("./pages/admin/evaluation-administrations/[id]/view-evaluation")
)
const EditEvaluation = lazy(
  async () => await import("./pages/admin/evaluation-administrations/[id]/edit/edit_evaluation")
)
const EvaluationProgress = lazy(
  async () =>
    await import("./pages/admin/evaluation-administrations/[id]/progress/evaluation-progress")
)
const SelectEvaluees = lazy(
  async () => await import("./pages/admin/evaluation-administrations/[id]/select/select-evaluees")
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
const EditExternalEvaluator = lazy(
  async () => await import("./pages/admin/external-evaluators/[id]/edit/edit-external-evaluator")
)

const SelectExternalEvaluators = lazy(
  async () =>
    await import(
      "./pages/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/select-external/select-external-evaluators"
    )
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
      {
        path: "/external-evaluations/:id/evaluations/:evaluation_id",
        element: <ExternalEvaluations />,
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
            path: "/evaluation-administrations",
            element: <UserEvaluationAdministrations />,
          },
          {
            path: "/evaluation-administrations/:id/evaluations/:evaluation_id",
            element: <Evaluations />,
          },
          {
            element: <InternalUserRoute />,
            children: [
              /* {
                path: "/dashboard",
                element: <Dashboard />,
              }, */
              {
                path: "/my-evaluations",
                element: <MyEvaluations />,
              },
              {
                path: "/my-evaluations/:id",
                element: <MyEvaluationResults />,
              },
            ],
          },
          {
            element: <AdminRoute />,
            children: [
              /* {
                path: "/sample",
                element: <Sample />,
              }, */
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
                path: "/admin/evaluation-administrations/:id/progress",
                element: <EvaluationProgress />,
              },
              {
                path: "/admin/evaluation-administrations/:id/edit",
                element: <EditEvaluation />,
              },
              {
                path: "/admin/evaluation-administrations/:id/select",
                element: <SelectEvaluees />,
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
              {
                path: "/admin/external-evaluators/:id/edit",
                element: <EditExternalEvaluator />,
              },
              {
                path: "/admin/evaluation-administrations/:id/evaluees/:evaluation_result_id/evaluators/:evaluation_template_id/select-external",
                element: <SelectExternalEvaluators />,
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
