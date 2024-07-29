import { createSlice } from "@reduxjs/toolkit"

interface Alert {
  description: string | string[]
  variant: "primary" | "success" | "destructive"
  autoClose?: boolean
}

interface InitialState {
  activeSidebar: boolean
  alerts: Alert[]
  multipleAlerts: boolean
  previousUrl: string | null
  autoClose?: boolean
}

const initialState: InitialState = {
  activeSidebar: true,
  alerts: [],
  multipleAlerts: false, // Set to true to enable multiple alerts
  previousUrl: null,
  autoClose: true,
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
    removeAlert: (state, action) => {
      state.alerts.splice(action.payload, 1)
    },
    removeAllAlert: (state) => {
      state.alerts = []
    },
    setMultipleAlerts: (state, action) => {
      state.multipleAlerts = action.payload
    },
    setPreviousUrl: (state, action) => {
      state.previousUrl = action.payload
    },
    setAutoClose: (state, action) => {
      state.autoClose = action.payload
    },
  },
})

export const {
  setActiveSidebar,
  setAlert,
  removeAlert,
  setMultipleAlerts,
  setPreviousUrl,
  setAutoClose,
  removeAllAlert,
} = appSlice.actions
export default appSlice.reducer
