import { lazy } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAdmin } from "@hooks/useAdmin"
import { routes } from "@routes/routes"

const EvaluationAdministrations = lazy(
  async () => await import("@pages/admin/evaluation-administrations/evaluation-administrations")
)
const CreateEvaluation = lazy(
  async () => await import("@pages/admin/evaluation-administrations/create/create-evaluation")
)
const ViewEvaluation = lazy(
  async () => await import("@pages/admin/evaluation-administrations/[id]/view-evaluation")
)
const EditEvaluation = lazy(
  async () =>
    await import("@pages/admin/evaluation-administrations/[id]/edit/edit-evaluation-administration")
)
const EvaluationProgress = lazy(
  async () =>
    await import("@pages/admin/evaluation-administrations/[id]/progress/evaluation-progress")
)
const SelectEvaluees = lazy(
  async () => await import("@pages/admin/evaluation-administrations/[id]/select/select-evaluees")
)
const PreviewEvaluees = lazy(
  async () => await import("@pages/admin/evaluation-administrations/[id]/preview/preview-evaluees")
)
const Evaluees = lazy(
  async () => await import("@pages/admin/evaluation-administrations/[id]/evaluees/evaluees")
)
const Evaluators = lazy(
  async () =>
    await import(
      "@pages/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/evaluators"
    )
)

const ExternalEvaluators = lazy(
  async () => await import("@pages/admin/external-evaluators/external-evaluators")
)

const CreateExternalEvaluator = lazy(
  async () => await import("@pages/admin/external-evaluators/create/create-external-evaluator")
)
const EditExternalEvaluator = lazy(
  async () => await import("@pages/admin/external-evaluators/[id]/edit/edit-external-evaluator")
)

const AddEvaluator = lazy(
  async () =>
    await import(
      "@pages/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/add-evaluator/add-evaluator"
    )
)
const SelectExternalEvaluators = lazy(
  async () =>
    await import(
      "@pages/admin/evaluation-administrations/[id]/evaluees/[evaluation_result_id]/evaluators/select-external/select-external-evaluators"
    )
)

const Projects = lazy(async () => await import("@pages/admin/projects/projects"))

const ViewProject = lazy(async () => await import("@pages/admin/projects/[id]/view-project"))

const CreateProject = lazy(async () => await import("@pages/admin/projects/create/create-project"))

const SelectSkills = lazy(
  async () => await import("@pages/admin/projects/create/select-skills/select-skills")
)

const EditProject = lazy(async () => await import("@pages/admin/projects/[id]/edit/edit-project"))

const ProjectAssignments = lazy(
  async () => await import("@pages/admin/project-assignments/project-assignments")
)

const CreateProjectAssignment = lazy(
  async () => await import("@pages/admin/project-assignments/create/create-project-assignment")
)

const EditProjectAssignment = lazy(
  async () => await import("@pages/admin/project-assignments/[id]/edit/edit-project-assignment")
)

const SelectProjectMemberSkills = lazy(
  async () =>
    await import(
      "@pages/admin/project-assignments/create/select-project-member-skills/select-project-member-skills"
    )
)

const EmailTemplates = lazy(
  async () => await import("@pages/admin/email-templates/email-templates")
)

const CreateEmailTemplate = lazy(
  async () => await import("@pages/admin/email-templates/create/create-email-template")
)

const EditEmailTemplate = lazy(
  async () => await import("@pages/admin/email-templates/[id]/edit/edit-email-template")
)

const EvaluationTemplates = lazy(
  async () => await import("@pages/admin/evaluation-templates/evaluation-templates")
)

const CreateEvaluationTemplate = lazy(
  async () => await import("@pages/admin/evaluation-templates/create/create-evaluation-template")
)

const ViewEvaluationTemplate = lazy(
  async () => await import("@pages/admin/evaluation-templates/[id]/view-evaluation-template")
)

const EditEvaluationTemplate = lazy(
  async () => await import("@pages/admin/evaluation-templates/[id]/edit/edit-evaluation-template")
)

const Skills = lazy(async () => await import("@pages/admin/skills/skills"))

const SkillCategories = lazy(
  async () => await import("@pages/admin/skill-categories/skill-categories")
)

const SurveyAdministrations = lazy(
  async () => await import("@pages/admin/survey-administrations/survey-administrations")
)

const SurveyResults = lazy(async () => await import("@pages/admin/survey-results/survey-results"))

const CreateSurveyAdministration = lazy(
  async () =>
    await import("@pages/admin/survey-administrations/create/create-survey-administration")
)

const ViewSurveyAdministration = lazy(
  async () => await import("@pages/admin/survey-administrations/[id]/view-survey-admin")
)

const EditSurveyAdministration = lazy(
  async () =>
    await import("@pages/admin/survey-administrations/[id]/edit/edit-survey-administration")
)

const SelectRespondents = lazy(
  async () => await import("@pages/admin/survey-administrations/[id]/select/select-respondents")
)

const PreviewRespondents = lazy(
  async () => await import("@pages/admin/survey-administrations/[id]/preview/preview-respondents")
)

const ViewSurveyResults = lazy(
  async () => await import("@pages/admin/survey-results/[id]/view-survey-results")
)

const SkillMapAdministrations = lazy(
  async () => await import("@pages/admin/skill-map-administrations/skill-map-administrations")
)

const ViewSkillMapAdministration = lazy(
  async () => await import("@pages/admin/skill-map-administrations/[id]/view-skill-map-admin")
)

const CreateSkillMapAdmin = lazy(
  async () => await import("@pages/admin/skill-map-administrations/create/create-skill-map-admin")
)

const UploadSkillMapAdmin = lazy(
  async () => await import("@pages/admin/skill-map-administrations/upload/upload-skill-map-admin")
)

const EditSkillMapAdmin = lazy(
  async () => await import("@pages/admin/skill-map-administrations/[id]/edit/edit-skill-map-admin")
)

const SelectEmployees = lazy(
  async () => await import("@pages/admin/skill-map-administrations/[id]/select/select-employees")
)

const PreviewEmployees = lazy(
  async () => await import("@pages/admin/skill-map-administrations/[id]/preview/preview-employees")
)

const SkillMapResults = lazy(
  async () => await import("@pages/admin/skill-map-results/skill-map-results-list")
)

const SkillMapSearch = lazy(
  async () => await import("@pages/admin/skill-map-search/skill-map-search")
)

const SkillMapAdminResults = lazy(
  async () => await import("@pages/admin/skill-map-administrations/[id]/results/skill-map-results")
)

export const adminRoutes = {
  element: <AdminRoute />,
  children: [
    // {
    //   path: "/sample",
    //   element: <Sample />,
    // },
    /**
     * Evaluation Administrations
     */
    {
      path: routes.private.admin.evaluationAdministrations,
      element: <EvaluationAdministrations />,
    },
    {
      path: routes.private.admin.createEvaluation,
      element: <CreateEvaluation />,
    },
    {
      path: routes.private.admin.viewEvaluation,
      element: <ViewEvaluation />,
    },
    {
      path: routes.private.admin.evaluationProgress,
      element: <EvaluationProgress />,
    },
    {
      path: routes.private.admin.editEvaluation,
      element: <EditEvaluation />,
    },
    {
      path: routes.private.admin.selectEvaluees,
      element: <SelectEvaluees />,
    },
    {
      path: routes.private.admin.previewEvaluees,
      element: <PreviewEvaluees />,
    },
    {
      path: routes.private.admin.evaluees,
      element: <Evaluees />,
    },
    {
      path: routes.private.admin.evaluators,
      element: <Evaluators />,
    },
    /**
     * External Evaluators
     */
    {
      path: routes.private.admin.externalEvaluators,
      element: <ExternalEvaluators />,
    },
    {
      path: routes.private.admin.createExternalEvaluator,
      element: <CreateExternalEvaluator />,
    },
    {
      path: routes.private.admin.editExternalEvaluator,
      element: <EditExternalEvaluator />,
    },
    {
      path: routes.private.admin.addEvaluator,
      element: <AddEvaluator />,
    },
    {
      path: routes.private.admin.selectExternalEvaluators,
      element: <SelectExternalEvaluators />,
    },
    /**
     * Projects
     */
    {
      path: routes.private.admin.projects,
      element: <Projects />,
    },
    {
      path: routes.private.admin.viewProject,
      element: <ViewProject />,
    },
    {
      path: routes.private.admin.createProject,
      element: <CreateProject />,
    },
    {
      path: routes.private.admin.selectSkills,
      element: <SelectSkills />,
    },
    {
      path: routes.private.admin.editProject,
      element: <EditProject />,
    },
    /**
     * Project Assignments
     */
    {
      path: routes.private.admin.projectAssignments,
      element: <ProjectAssignments />,
    },
    {
      path: routes.private.admin.createProjectAssignment,
      element: <CreateProjectAssignment />,
    },
    {
      path: routes.private.admin.editProjectAssignment,
      element: <EditProjectAssignment />,
    },
    {
      path: routes.private.admin.selectProjectMemberSkills,
      element: <SelectProjectMemberSkills />,
    },
    /**
     * Email Templates
     */
    {
      path: routes.private.admin.emailTemplates,
      element: <EmailTemplates />,
    },
    {
      path: routes.private.admin.createEmailTemplate,
      element: <CreateEmailTemplate />,
    },
    {
      path: routes.private.admin.editEmailTemplate,
      element: <EditEmailTemplate />,
    },
    /**
     * Evaluation Templates
     */
    {
      path: routes.private.admin.evaluationTemplates,
      element: <EvaluationTemplates />,
    },
    {
      path: routes.private.admin.createEvaluationTemplate,
      element: <CreateEvaluationTemplate />,
    },
    {
      path: routes.private.admin.viewEvaluationTemplate,
      element: <ViewEvaluationTemplate />,
    },
    {
      path: routes.private.admin.editEvaluationTemplate,
      element: <EditEvaluationTemplate />,
    },
    /**
     * Skills
     */
    {
      path: routes.private.admin.skills,
      element: <Skills />,
    },
    /**
     * Skill Categories
     */
    {
      path: routes.private.admin.skillCategories,
      element: <SkillCategories />,
    },
    /**
     * Survey Administrations
     */
    {
      path: routes.private.admin.surveyAdministrations,
      element: <SurveyAdministrations />,
    },
    {
      path: routes.private.admin.viewSurveyAdministrations,
      element: <ViewSurveyAdministration />,
    },
    {
      path: routes.private.admin.createSurveyAdministration,
      element: <CreateSurveyAdministration />,
    },
    {
      path: routes.private.admin.editSurveyAdministration,
      element: <EditSurveyAdministration />,
    },
    {
      path: routes.private.admin.selectRespondents,
      element: <SelectRespondents />,
    },
    {
      path: routes.private.admin.previewRespondents,
      element: <PreviewRespondents />,
    },
    /**
     * Survey Results
     */
    {
      path: routes.private.admin.surveyResults,
      element: <SurveyResults />,
    },
    {
      path: routes.private.admin.viewSurveyResults,
      element: <ViewSurveyResults />,
    },
    /**
     * Skill Map Administrations
     */
    {
      path: routes.private.admin.skillMapAdministrations,
      element: <SkillMapAdministrations />,
    },
    {
      path: routes.private.admin.viewSkillMapAdministration,
      element: <ViewSkillMapAdministration />,
    },
    {
      path: routes.private.admin.createSkillMapAdmin,
      element: <CreateSkillMapAdmin />,
    },
    {
      path: routes.private.admin.uploadSkillMapAdmin,
      element: <UploadSkillMapAdmin />,
    },
    {
      path: routes.private.admin.editSkillMapADmin,
      element: <EditSkillMapAdmin />,
    },
    {
      path: routes.private.admin.selectEmployees,
      element: <SelectEmployees />,
    },
    {
      path: routes.private.admin.previewEmployees,
      element: <PreviewEmployees />,
    },
    {
      path: routes.private.admin.skillMapResults,
      element: <SkillMapResults />,
    },
    {
      path: routes.private.admin.skillMapSearch,
      element: <SkillMapSearch />,
    },
    {
      path: routes.private.admin.resultsSkillMapAdmin,
      element: <SkillMapAdminResults />,
    },
  ],
}

export default function AdminRoute() {
  const isAdmin = useAdmin()
  return isAdmin ? <Outlet /> : <Navigate to='/my-evaluations' />
}
