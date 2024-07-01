import { createSlice } from "@reduxjs/toolkit"

interface Alert {
  description: string | string[]
  variant: "primary" | "success" | "destructive"
}

interface InitialState {
  activeSidebar: boolean
  alerts: Alert[]
  multipleAlerts: boolean
  previousUrl: string | null
}

const initialState: InitialState = {
  activeSidebar: true,
  alerts: [],
  multipleAlerts: false, // Set to true to enable multiple alerts
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
      if (state.multipleAlerts) {
        state.alerts.push(action.payload)
      } else {
        state.alerts = [action.payload]
      }
    },
    removeAlert: (state, _) => {
      state.alerts = []
    },
    setMultipleAlerts: (state, action) => {
      state.multipleAlerts = action.payload
    },
    setPreviousUrl: (state, action) => {
      state.previousUrl = action.payload
    },
  },
})

export const { setActiveSidebar, setAlert, removeAlert, setMultipleAlerts, setPreviousUrl } =
  appSlice.actions
export default appSlice.reducer
