import { createSlice } from "@reduxjs/toolkit"

interface InitialState {
  activeSidebar: boolean
  alertDescription?: string
  alertVariant: "primary" | "success"
}

const initialState: InitialState = {
  activeSidebar: true,
  alertDescription: undefined,
  alertVariant: "primary",
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
  },
})

export const { setActiveSidebar, setAlert } = appSlice.actions
export default appSlice.reducer
