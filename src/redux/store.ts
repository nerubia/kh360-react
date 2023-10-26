import { configureStore } from "@reduxjs/toolkit"
import appReducer from "./slices/appSlice"
import authReducer from "./slices/authSlice"
import evaluationAdministrationReducer from "./slices/evaluationAdministrationSlice"
import evaluationAdministrationsReducer from "./slices/evaluationAdministrationsSlice"
import evaluationsReducer from "./slices/evaluationsSlice"
import employeesReducer from "./slices/employeesSlice"
import emailTemplateReducer from "./slices/emailTemplateSlice"
import evaluationTemplatesReducer from "./slices/evaluationTemplatesSlice"
import evaluationResultReducer from "./slices/evaluationResultSlice"
import evaluationResultsReducer from "./slices/evaluationResultsSlice"

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    evaluationAdministration: evaluationAdministrationReducer,
    evaluationAdministrations: evaluationAdministrationsReducer,
    evaluations: evaluationsReducer,
    employees: employeesReducer,
    emailTemplate: emailTemplateReducer,
    evaluationTemplates: evaluationTemplatesReducer,
    evaluationResult: evaluationResultReducer,
    evaluationResults: evaluationResultsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
