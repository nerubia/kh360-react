import { configureStore } from "@reduxjs/toolkit"
import appReducer from "./slices/app-slice"
import authReducer from "./slices/auth-slice"

import emailTemplateReducer from "./slices/email-template-slice"
import evaluationAdministrationReducer from "./slices/evaluation-administration-slice"
import evaluationAdministrationsReducer from "./slices/evaluation-administrations-slice"
import evaluationResultReducer from "./slices/evaluation-result-slice"
import evaluationResultsReducer from "./slices/evaluation-results-slice"
import evaluationsReducer from "./slices/evaluations-slice"
import evaluationTemplateReducer from "./slices/evaluation-template-slice"
import evaluationTemplatesReducer from "./slices/evaluation-templates-slice"
import evaluationTemplateContentsReducer from "./slices/evaluation-template-contents-slice"
import evaluationTemplateContentReducer from "./slices/evaluation-template-content-slice"
import externalUserReducer from "./slices/external-user-slice"
import externalUsersReducer from "./slices/external-users-slice"
import projectMembersReducer from "./slices/project-members-slice"
import projectRolesReducer from "./slices/project-roles-slice"
import projectsReducer from "./slices/projects-slice"
import scoreRatingsReducer from "./slices/score-ratings-slice"
import usersReducer from "./slices/users-slice"
import userReducer from "./slices/user-slice"

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
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
    projectMembers: projectMembersReducer,
    projectRoles: projectRolesReducer,
    projects: projectsReducer,
    scoreRatings: scoreRatingsReducer,
    users: usersReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
