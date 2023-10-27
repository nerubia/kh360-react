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
import usersReducer from "./slices/usersSlice"

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
    users: usersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
