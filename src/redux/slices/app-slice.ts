import { createSlice } from "@reduxjs/toolkit"

interface InitialState {
  activeSidebar: boolean
  alertDescription?: string
  alertVariant: "primary" | "success"
  previousUrl: string | null
}

const initialState: InitialState = {
  activeSidebar: true,
  alertDescription: undefined,
  alertVariant: "primary",
  previousUrl: null,
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setActiveSidebar: (state, action) => {
      state.activeSidebar = action.payload
    },
    setAlert: (state, action) => {
      state.alertDescription = action.payload.description
      state.alertVariant = action.payload.variant
    },
    setPreviousUrl: (state, action) => {
      state.previousUrl = action.payload
    },
  },
})

export const { setActiveSidebar, setAlert, setPreviousUrl } = appSlice.actions
export default appSlice.reducer
