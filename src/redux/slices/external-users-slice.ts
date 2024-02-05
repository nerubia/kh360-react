import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { axiosInstance } from "@utils/axios-instance"
import { Loading } from "@custom-types/loadingType"
import { type ExternalUser, type ExternalUserFilters } from "@custom-types/external-user-type"
import { type ExternalUserFormData } from "@custom-types/form-data-type"

export const getExternalUsers = createAsyncThunk(
  "externalUser/getExternalUsers",
  async (params: ExternalUserFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/external-users", {
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

export const getExternalUsersOnScroll = createAsyncThunk(
  "externalUser/getExternalUsersOnScroll",
  async (params: ExternalUserFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/external-users", {
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

export const createExternalUser = createAsyncThunk(
  "externalUser/createExternalUser",
  async (data: ExternalUserFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post("/admin/external-users", data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const updateExternalUser = createAsyncThunk(
  "externalUser/updateExternalUser",
  async (
    data: {
      id: number
      external_user_data: ExternalUserFormData
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.put(
        `/admin/external-users/${data.id}`,
        data.external_user_data
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const deleteExternalUser = createAsyncThunk(
  "externalUser/deleteExternalUser",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.delete(`/admin/external-users/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

interface InitialState {
  loading: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  external_users: ExternalUser[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  currentPage: number
  totalPages: number
  totalItems: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  external_users: [],
  hasPreviousPage: false,
  hasNextPage: false,
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
}

const externalEvaluatorsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setExternalUsers: (state, action) => {
      state.external_users = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * List external evaluators
     */
    builder.addCase(getExternalUsers.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getExternalUsers.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.external_users = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getExternalUsers.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List external evaluators on scroll
     */
    builder.addCase(getExternalUsersOnScroll.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getExternalUsersOnScroll.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      if (action.payload.pageInfo.currentPage > 1) {
        const newData: ExternalUser[] = []
        const payloadData = action.payload.data as ExternalUser[]
        for (const data of payloadData) {
          if (!state.external_users.some((user) => user.id === data.id)) {
            newData.push(data)
          }
        }
        state.external_users = payloadData.length > 0 ? [...state.external_users, ...newData] : []
      } else {
        state.external_users = action.payload.data
      }
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.currentPage = action.payload.pageInfo.currentPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getExternalUsersOnScroll.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Create
     */
    builder.addCase(createExternalUser.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(createExternalUser.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(createExternalUser.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Update
     */
    builder.addCase(updateExternalUser.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(updateExternalUser.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(updateExternalUser.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Delete
     */
    builder.addCase(deleteExternalUser.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(deleteExternalUser.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.external_users = state.external_users.filter(
        (user) => user.id !== parseInt(action.payload.id)
      )
      state.totalItems = state.totalItems - 1
    })
    builder.addCase(deleteExternalUser.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setExternalUsers } = externalEvaluatorsSlice.actions
export default externalEvaluatorsSlice.reducer
