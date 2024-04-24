import { lazy } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useInternalUser } from "@hooks/use-internal-user"
import { routes } from "@routes/routes"

const MyEvaluations = lazy(async () => await import("@pages/my-evaluations/my-evaluations"))
const MyEvaluationResults = lazy(
  async () => await import("@pages/my-evaluations/[id]/my-evaluation-results")
)
const SurveyForm = lazy(async () => await import("@pages/survey-forms/survey-forms"))
const SurveyFormCompanion = lazy(
  async () => await import("@pages/survey-forms/[id]/companions/survey-form-companion")
)
const SurveyForms = lazy(async () => await import("@pages/survey-forms/[id]/survey-form"))

const SkillMapForm = lazy(async () => await import("@pages/skill-map-forms/[id]/skill-map-form"))
const AddSkills = lazy(async () => await import("@pages/skill-map-forms/[id]/add/add-skills"))

export const internalUserRoutes = {
  element: <InternalUserRoute />,
  children: [
    /* {
      path: "/dashboard",
      element: <Dashboard />,
    }, */
    {
      path: routes.private.internalUser.myEvaluations,
      element: <MyEvaluations />,
    },
    {
      path: routes.private.internalUser.myEvaluationResults,
      element: <MyEvaluationResults />,
    },
    {
      path: routes.private.internalUser.surveyForms,
      element: <SurveyForm />,
    },
    {
      path: routes.private.internalUser.surveyForm,
      element: <SurveyForms />,
    },
    {
      path: routes.private.internalUser.surveyForm,
      element: <SurveyForms />,
    },
    {
      path: routes.private.internalUser.surveyFormCompanion,
      element: <SurveyFormCompanion />,
    },
    {
      path: routes.private.internalUser.skillMapForm,
      element: <SkillMapForm />,
    },
    {
      path: routes.private.internalUser.addSkills,
      element: <AddSkills />,
    },
  ],
}

export default function InternalUserRoute() {
  const isInternalUser = useInternalUser()
  return isInternalUser ? <Outlet /> : <Navigate to='/evaluation-administrations' />
}
