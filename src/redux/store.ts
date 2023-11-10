import { configureStore } from "@reduxjs/toolkit"
import appReducer from "./slices/appSlice"
import authReducer from "./slices/authSlice"

import emailTemplateReducer from "./slices/emailTemplateSlice"
import evaluationAdministrationReducer from "./slices/evaluationAdministrationSlice"
import evaluationAdministrationsReducer from "./slices/evaluationAdministrationsSlice"
import evaluationResultReducer from "./slices/evaluationResultSlice"
import evaluationResultsReducer from "./slices/evaluationResultsSlice"
import evaluationsReducer from "./slices/evaluationsSlice"
import evaluationTemplatesReducer from "./slices/evaluationTemplatesSlice"
import evaluationTemplateContentsReducer from "./slices/evaluationTemplateContentsSlice"
import usersReducer from "./slices/usersSlice"
import userReducer from "./slices/userSlice"

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
    users: usersReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
