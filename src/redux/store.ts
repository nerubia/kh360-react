import { configureStore } from "@reduxjs/toolkit"
import appReducer from "@redux/slices/app-slice"
import authReducer from "@redux/slices/auth-slice"

import answerReducer from "@redux/slices/answer-slice"
import clientsReducer from "@redux/slices/clients-slice"
import emailTemplateReducer from "@redux/slices/email-template-slice"
import evaluationAdministrationReducer from "@redux/slices/evaluation-administration-slice"
import evaluationAdministrationsReducer from "@redux/slices/evaluation-administrations-slice"
import evaluationResultReducer from "@redux/slices/evaluation-result-slice"
import evaluationResultsReducer from "@redux/slices/evaluation-results-slice"
import evaluationsReducer from "@redux/slices/evaluations-slice"
import evaluationTemplateReducer from "@redux/slices/evaluation-template-slice"
import evaluationTemplatesReducer from "@redux/slices/evaluation-templates-slice"
import evaluationTemplateContentsReducer from "@redux/slices/evaluation-template-contents-slice"
import evaluationTemplateContentReducer from "@redux/slices/evaluation-template-content-slice"
import externalUserReducer from "@redux/slices/external-user-slice"
import externalUsersReducer from "@redux/slices/external-users-slice"
import projectMemberReducer from "@redux/slices/project-member-slice"
import projectMembersReducer from "@redux/slices/project-members-slice"
import projectRolesReducer from "@redux/slices/project-roles-slice"
import projectSkillsReducer from "@redux/slices/project-skills-slice"
import projectReducer from "@redux/slices/project-slice"
import projectsReducer from "@redux/slices/projects-slice"
import scoreRatingsReducer from "@redux/slices/score-ratings-slice"
import skillReducer from "@redux/slices/skill-slice"
import skillsReducer from "@redux/slices/skills-slice"
import skillCategoryReducer from "@redux/slices/skill-category-slice"
import skillCategoriesReducer from "@redux/slices/skill-categories-slice"
import surveyAdministrationReducer from "./slices/survey-administration-slice"
import surveyAdministrationsReducer from "./slices/survey-administrations-slice"
import surveyResultsReducer from "./slices/survey-results-slice"
import surveyTemplatesReducer from "./slices/survey-templates-slice"
import usersReducer from "@redux/slices/users-slice"
import userReducer from "@redux/slices/user-slice"

export const store = configureStore({
  reducer: {
    app: appReducer,
    answer: answerReducer,
    auth: authReducer,
    clients: clientsReducer,
    emailTemplate: emailTemplateReducer,
    evaluationAdministration: evaluationAdministrationReducer,
    evaluationAdministrations: evaluationAdministrationsReducer,
    evaluationResult: evaluationResultReducer,
    evaluationResults: evaluationResultsReducer,
    evaluations: evaluationsReducer,
    evaluationTemplate: evaluationTemplateReducer,
    evaluationTemplates: evaluationTemplatesReducer,
    evaluationTemplateContents: evaluationTemplateContentsReducer,
    evaluationTemplateContent: evaluationTemplateContentReducer,
    externalUser: externalUserReducer,
    externalUsers: externalUsersReducer,
    projectMember: projectMemberReducer,
    projectMembers: projectMembersReducer,
    projectRoles: projectRolesReducer,
    projectSkills: projectSkillsReducer,
    project: projectReducer,
    projects: projectsReducer,
    scoreRatings: scoreRatingsReducer,
    skill: skillReducer,
    skills: skillsReducer,
    skillCategory: skillCategoryReducer,
    skillCategories: skillCategoriesReducer,
    surveyAdministration: surveyAdministrationReducer,
    surveyAdministrations: surveyAdministrationsReducer,
    surveyResults: surveyResultsReducer,
    surveyTemplates: surveyTemplatesReducer,
    users: usersReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
