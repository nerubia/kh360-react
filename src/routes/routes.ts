const evaluationAdministrations = "admin/evaluation-administrations"
const externalEvaluators = "admin/external-evaluators"
const projects = "admin/projects"
const projectAssignments = "admin/project-assignments"
const messageTemplates = "admin/message-templates"
const evaluationTemplates = "admin/evaluation-templates"
const skills = "admin/skills"
const skillCategories = "admin/skill-categories"
const skillMapAdministrations = "admin/skill-map-administrations"
const surveyAdministrations = "admin/survey-administrations"
const surveyResults = "admin/survey-results"

export const routes = {
  home: "/",
  notFound: "*",
  auth: {
    login: "/auth/login",
    forgotPassword: "/auth/forgot",
    resetPassword: "/auth/reset",
  },
  guest: {
    externalEvaluations: "/external-evaluations/:id/evaluations/:evaluation_id",
  },
  private: {
    userEvaluationAdministrations: "/evaluation-administrations",
    userEvaluations: "/evaluation-administrations/:id/evaluations/:evaluation_id",
    admin: {
      evaluationAdministrations,
      createEvaluation: `${evaluationAdministrations}/create`,
      viewEvaluation: `${evaluationAdministrations}/:id`,
      evaluationProgress: `${evaluationAdministrations}/:id/progress`,
      editEvaluation: `${evaluationAdministrations}/:id/edit`,
      selectEvaluees: `${evaluationAdministrations}/:id/select`,
      previewEvaluees: `${evaluationAdministrations}/:id/preview`,
      evaluees: `${evaluationAdministrations}/:id/evaluees`,
      evaluators: `${evaluationAdministrations}/:id/evaluees/:evaluation_result_id/evaluators/:evaluation_template_id`,
      externalEvaluators,
      createExternalEvaluator: `${externalEvaluators}/create`,
      editExternalEvaluator: `${externalEvaluators}/:id/edit`,
      addEvaluator: `${evaluationAdministrations}/:id/evaluees/:evaluation_result_id/evaluators/:evaluation_template_id/add-evaluator`,
      selectExternalEvaluators: `${evaluationAdministrations}/:id/evaluees/:evaluation_result_id/evaluators/:evaluation_template_id/select-external`,
      projects,
      viewProject: `${projects}/:id`,
      createProject: `${projects}/create`,
      selectSkills: `${projects}/create/select-skills`,
      editProject: `${projects}/:id/edit`,
      projectAssignments,
      createProjectAssignment: `${projectAssignments}/create`,
      editProjectAssignment: `${projectAssignments}/:id/edit`,
      selectProjectMemberSkills: `${projectAssignments}/select/:project_id`,
      emailTemplates: messageTemplates,
      createEmailTemplate: `${messageTemplates}/create`,
      editEmailTemplate: `${messageTemplates}/:id/edit`,
      evaluationTemplates,
      createEvaluationTemplate: `${evaluationTemplates}/create`,
      viewEvaluationTemplate: `${evaluationTemplates}/:id`,
      editEvaluationTemplate: `${evaluationTemplates}/:id/edit`,
      skills,
      skillCategories,
      skillMapAdministrations,
      viewSkillMapAdministration: `${skillMapAdministrations}/:id`,
      createSkillMapAdmin: `${skillMapAdministrations}/create`,
      uploadSkillMapAdmin: `${skillMapAdministrations}/upload`,
      skillMapSearch: `${skillMapAdministrations}-search`,
      skillMapResults: `${skillMapAdministrations}-results`,
      selectEmployees: `${skillMapAdministrations}/:id/select`,
      previewEmployees: `${skillMapAdministrations}/:id/preview`,
      editSkillMapADmin: `${skillMapAdministrations}/:id/edit`,
      resultsSkillMapAdmin: `${skillMapAdministrations}/:id/results`,
      surveyAdministrations,
      viewSurveyAdministrations: `${surveyAdministrations}/:id`,
      createSurveyAdministration: `${surveyAdministrations}/create`,
      editSurveyAdministration: `${surveyAdministrations}/:id/edit`,
      selectRespondents: `${surveyAdministrations}/:id/select`,
      previewRespondents: `${surveyAdministrations}/:id/preview`,
      surveyResults,
      viewSurveyResults: `${surveyResults}/:id`,
    },
    cmUser: {
      evaluationResultsList: "/evaluation-results",
      viewEvaluationResults: "/evaluation-results/:id",
    },
    internalUser: {
      myEvaluations: "/my-evaluations",
      myEvaluationResults: "/my-evaluations/:id",
      surveyForms: "/survey-forms",
      surveyForm: "survey-forms/:id",
      surveyFormCompanion: "survey-forms/:id/companions/:survey_result_id",
      mySkillMap: "/my-skill-map",
      skillMapForms: "/skill-map-forms",
      skillMapForm: "/skill-map-forms/:id",
      addSkills: "/skill-map-forms/:id/add",
    },
  },
}
