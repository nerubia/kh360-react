import { configureStore } from "@reduxjs/toolkit"
import appReducer from "./slices/appSlice"
import authReducer from "./slices/authSlice"
import evaluationsReducer from "./slices/evaluationsSlice"

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    evaluations: evaluationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
