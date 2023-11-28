import { configureStore } from "@reduxjs/toolkit"
import appReducer from "./slices/appSlice"
import authReducer from "./slices/authSlice"

import emailTemplateReducer from "./slices/email-template-slice"
import evaluationAdministrationReducer from "./slices/evaluation-administration-slice"
import evaluationAdministrationsReducer from "./slices/evaluation-administrations-slice"
import evaluationResultReducer from "./slices/evaluationResultSlice"
import evaluationResultsReducer from "./slices/evaluationResultsSlice"
import evaluationsReducer from "./slices/evaluations-slice"
import evaluationTemplatesReducer from "./slices/evaluationTemplatesSlice"
import evaluationTemplateContentsReducer from "./slices/evaluation-template-contents-slice"
import externalUserReducer from "./slices/external-user-slice"
import externalUsersReducer from "./slices/external-users-slice"
import usersReducer from "./slices/usersSlice"
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
    evaluationTemplates: evaluationTemplatesReducer,
    evaluationTemplateContents: evaluationTemplateContentsReducer,
    externalUser: externalUserReducer,
    externalUsers: externalUsersReducer,
    users: usersReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
