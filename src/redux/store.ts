import { configureStore } from "@reduxjs/toolkit"
import appReducer from "./slices/appSlice"
import authReducer from "./slices/authSlice"
import evaluationsReducer from "./slices/evaluationsSlice"
import evaluationReducer from "./slices/evaluationSlice"
import evaluationAdministrationsReducer from "./slices/evaluationAdministrationsSlice"
import employeesReducer from "./slices/employeesSlice"
import evalueesReducer from "./slices/evalueesSlice"
import emailTemplateReducer from "./slices/emailTemplateSlice"
import evaluationTemplatesReducer from "./slices/evaluationTemplatesSlice"
import evaluationResultReducer from "./slices/evaluationResultSlice"

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    evaluations: evaluationsReducer,
    evaluation: evaluationReducer,
    evaluationAdministrations: evaluationAdministrationsReducer,
    employees: employeesReducer,
    evaluees: evalueesReducer,
    emailTemplate: emailTemplateReducer,
    evaluationTemplates: evaluationTemplatesReducer,
    evaluationResult: evaluationResultReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
