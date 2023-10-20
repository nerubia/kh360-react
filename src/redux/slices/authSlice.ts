import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type CodeResponse } from "@react-oauth/google"
import { type ApiError } from "../../types/apiErrorType"
import { type User } from "../../types/userType"
import { refreshUserToken } from "../../services/api"
import { Loading } from "../../types/loadingType"
import { type LoginFormData } from "../../types/formDataType"
import { axiosInstance } from "../../utils/axiosInstance"

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post("/auth/login", data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (data: CodeResponse, thunkApi) => {
    try {
      const response = await axiosInstance.post("/auth/login/google", data)
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
    const response = await axiosInstance.post("/user/logout")
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response?.data as ApiError
    return thunkApi.rejectWithValue(response.message)
  }
})

interface InitialState {
  loading: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  access_token: string | null
  user: User | null
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  access_token: null,
  user: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.access_token = action.payload
    },
  },
  extraReducers(builder) {
    // login
    builder.addCase(login.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.access_token = action.payload.access_token
      state.user = action.payload.user
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    // login with google
    builder.addCase(loginWithGoogle.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(loginWithGoogle.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.access_token = action.payload.access_token
      state.user = action.payload.user
    })
    builder.addCase(loginWithGoogle.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    // refresh token
    builder.addCase(refreshToken.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
      state.access_token = null
      state.user = null
    })
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.access_token = action.payload.access_token
      state.user = action.payload.user
    })
    builder.addCase(refreshToken.rejected, (state) => {
      state.loading = Loading.Rejected
    })
    // logout
    builder.addCase(logout.pending, (state) => {
      state.loading = Loading.Pending
    })
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.access_token = null
      state.user = null
    })
    builder.addCase(logout.rejected, (state) => {
      state.loading = Loading.Rejected
    })
  },
})

export const { setAccessToken } = authSlice.actions
export default authSlice.reducer
