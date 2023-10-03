import { createSlice } from "@reduxjs/toolkit"

interface Auth {
  accessToken: string | null
}

const initialState: Auth = {
  accessToken: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload
    },
  },
})

export const { setAccessToken } = authSlice.actions
export default authSlice.reducer
