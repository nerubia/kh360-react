import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type CodeResponse } from "@react-oauth/google"
import { type ApiError } from "../../types/apiErrorType"
import { type User } from "../../types/user-type"
import { refreshUserToken } from "../../services/api"
import { Loading } from "../../types/loadingType"
import { type ExternalAuthFormData, type LoginFormData } from "../../types/formDataType"
import { axiosInstance } from "../../utils/axiosInstance"

export const login = createAsyncThunk("auth/login", async (data: LoginFormData, thunkApi) => {
  try {
    const response = await axiosInstance.post("/auth/login", data)
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response?.data as ApiError
    return thunkApi.rejectWithValue(response.message)
  }
})

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

export const loginAsExternalUser = createAsyncThunk(
  "auth/loginAsExternalUser",
  async (data: ExternalAuthFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post("/auth/login/external-user", data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const resendCode = createAsyncThunk(
  "auth/resendCode",
  async (data: ExternalAuthFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post("/auth/login/external-user/resend-code", data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const getExternalUserStatus = createAsyncThunk(
  "auth/getExternalUserStatus",
  async (
    params: {
      token: string
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.get("/auth/login/external-user/status", {
        params,
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const refreshToken = createAsyncThunk("auth/refreshToken", async (_, thunkApi) => {
  try {
    const response = await refreshUserToken()
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response?.data as ApiError
    return thunkApi.rejectWithValue(response.message)
  }
})

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
    /**
     * Login
     */
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
    /**
     * Login with google
     */
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
    /**
     * Login as external user
     */
    builder.addCase(loginAsExternalUser.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(loginAsExternalUser.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.access_token = action.payload.access_token
      state.user = action.payload.user
    })
    builder.addCase(loginAsExternalUser.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Resend code
     */
    builder.addCase(resendCode.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(resendCode.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(resendCode.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Refresh token
     */
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
    /**
     * Logout
     */
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
