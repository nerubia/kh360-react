import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type CodeResponse } from "@react-oauth/google"
import { type LoginFormData } from "../../types/authType"
import { type User } from "../../types/userType"
import {
  loginUser,
  loginUserWithGoogle,
  logoutUser,
  refreshUserToken,
} from "../../services/api"

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

export const loginWithGoogle = createAsyncThunk(
  "auth/login/google",
  async (data: CodeResponse, thunkApi) => {
    try {
      const response = await loginUserWithGoogle(data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkApi) => {
    try {
      const response = await refreshUserToken()
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const logout = createAsyncThunk("auth/logout", async (_, thunkApi) => {
  try {
    const response = await logoutUser()
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response?.data as ApiError
    return thunkApi.rejectWithValue(response.message)
  }
})

interface Auth {
  loading: boolean
  error: string | null
  accessToken: string | null
  user: User | null
}

const initialState: Auth = {
  loading: false,
  error: null,
  accessToken: null,
  user: null,
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
    // login
    builder.addCase(login.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
    // login with google
    builder.addCase(loginWithGoogle.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(loginWithGoogle.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
    })
    builder.addCase(loginWithGoogle.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
    // refresh token
    builder.addCase(refreshToken.pending, (state) => {
      state.loading = true
      state.error = null
      state.accessToken = null
      state.user = null
    })
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
    })
    builder.addCase(refreshToken.rejected, (state) => {
      state.loading = false
    })
    // logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true
    })
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false
      state.error = null
      state.accessToken = null
      state.user = null
    })
    builder.addCase(logout.rejected, (state) => {
      state.loading = false
    })
  },
})

export const { setAccessToken } = authSlice.actions
export default authSlice.reducer
