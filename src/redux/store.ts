import { configureStore } from "@reduxjs/toolkit"
import appReducer from "./slices/appSlice"
import authReducer from "./slices/authSlice"
import evaluationReducer from "./slices/evaluationSlice"
import evaluationsReducer from "./slices/evaluationsSlice"
import employeesReducer from "./slices/employeesSlice"
import emailTemplateReducer from "./slices/emailTemplateSlice"

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    evaluation: evaluationReducer,
    evaluations: evaluationsReducer,
    employees: employeesReducer,
    emailTemplate: emailTemplateReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
