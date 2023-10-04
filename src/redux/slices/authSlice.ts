import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type LoginFormData } from "../../types/authType"
import { loginUser } from "../../services/api"

interface ApiError {
  message: string
}

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginFormData, thunkApi) => {
    try {
      const response = await loginUser(data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

interface Auth {
  loading: boolean
  error: string | null
  accessToken: string | null
}

const initialState: Auth = {
  loading: false,
  error: null,
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
  extraReducers(builder) {
    builder.addCase(login.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.accessToken = action.payload
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

export const { setAccessToken } = authSlice.actions
export default authSlice.reducer
