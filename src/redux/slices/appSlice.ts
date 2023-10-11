import { createSlice } from "@reduxjs/toolkit"

interface App {
  activeSidebar: boolean
}

const initialState: App = {
  activeSidebar: true,
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setActiveSidebar: (state, action) => {
      state.activeSidebar = action.payload
    },
  },
})

export const { setActiveSidebar } = appSlice.actions
export default appSlice.reducer
