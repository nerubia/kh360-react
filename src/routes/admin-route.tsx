import { lazy } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAdmin } from "../hooks/useAdmin"

const EvaluationAdministrations = lazy(
  async () => await import("../pages/admin/evaluation-administrations/evaluation-administrations")
)
const CreateEvaluation = lazy(
  async () => await import("../pages/admin/evaluation-administrations/create/create-evaluation")
)
const ViewEvaluation = lazy(
  async () => await import("../pages/admin/evaluation-administrations/[id]/view-evaluation")
)
const EditEvaluation = lazy(
  async () => await import("../pages/admin/evaluation-administrations/[id]/edit/edit_evaluation")
)
const EvaluationProgress = lazy(
  async () =>
    await import("../pages/admin/evaluation-administrations/[id]/progress/evaluation-progress")
)
const SelectEvaluees = lazy(
  async () => await import("../pages/admin/evaluation-administrations/[id]/select/select-evaluees")
)
const PreviewEmployees = lazy(
  async () =>
    await import("../pages/admin/evaluation-administrations/[id]/preview/preview-employees")
)
const Evaluees = lazy(
  async () => await import("../pages/admin/evaluation-administrations/[id]/evaluees/evaluees")
)
const Evaluators = lazy(
  async () =>
    await import(
      "../pages/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/evaluators"
    )
)

const ExternalEvaluators = lazy(
  async () => await import("../pages/admin/external-evaluators/external-evaluators")
)

const CreateExternalEvaluator = lazy(
  async () => await import("../pages/admin/external-evaluators/create/create-external-evaluator")
)
const EditExternalEvaluator = lazy(
  async () => await import("../pages/admin/external-evaluators/[id]/edit/edit-external-evaluator")
)

const AddEvaluator = lazy(
  async () =>
    await import(
      "../pages/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/add-evaluator/add-evaluator"
    )
)
const SelectExternalEvaluators = lazy(
  async () =>
    await import(
      "../pages/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/select-external/select-external-evaluators"
    )
)

const ProjectAssignments = lazy(
  async () => await import("../pages/admin/project-assignments/project-assignments")
)

const CreateProjectAssignment = lazy(
  async () => await import("../pages/admin/project-assignments/create/create-project-assignment")
)

const EmailTemplates = lazy(
  async () => await import("../pages/admin/email-templates/email-templates")
)

const CreateEmailTemplate = lazy(
  async () => await import("../pages/admin/email-templates/create/create-email-template")
)

const EvaluationTemplates = lazy(
  async () => await import("../pages/admin/evaluation-templates/evaluation-templates")
)

const ViewEvaluationTemplate = lazy(
  async () => await import("../pages/admin/evaluation-templates/[id]/view-evaluation-template")
)

export const adminRoutes = {
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
      path: "/admin/evaluation-administrations/:id/evaluees/:evaluation_result_id/evaluators/:evaluation_template_id/add-evaluator",
      element: <AddEvaluator />,
    },
    {
      path: "/admin/evaluation-administrations/:id/evaluees/:evaluation_result_id/evaluators/:evaluation_template_id/select-external",
      element: <SelectExternalEvaluators />,
    },
    /**
     * Project Assignments
     */
    {
      path: "/admin/project-assignments",
      element: <ProjectAssignments />,
    },
    {
      path: "/admin/project-assignments/create",
      element: <CreateProjectAssignment />,
    },
    /**
     * Email Templates
     */
    {
      path: "/admin/message-templates",
      element: <EmailTemplates />,
    },
    {
      path: "/admin/message-templates/create",
      element: <CreateEmailTemplate />,
    },
    /**
     * Evaluation Templates
     */
    {
      path: "/admin/evaluation-templates",
      element: <EvaluationTemplates />,
    },
    {
      path: "/admin/evaluation-templates/:id",
      element: <ViewEvaluationTemplate />,
    },
  ],
}

export default function AdminRoute() {
  const isAdmin = useAdmin()
  return isAdmin ? <Outlet /> : <Navigate to='/dashboard' />
}
