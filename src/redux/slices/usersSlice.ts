import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { type User, type UserFilters } from "../../types/userType"
import { axiosInstance } from "../../utils/axiosInstance"
import { Loading } from "../../types/loadingType"

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (params: UserFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/users", {
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

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (params: UserFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/users/all", {
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

interface InitialState {
  loading: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  users: User[]
  allUsers: User[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
  checkedAll: boolean
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  users: [],
  allUsers: [],
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
  checkedAll: false,
}

const usersSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setCheckedAll: (state, action) => {
      state.checkedAll = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * List
     */
    builder.addCase(getUsers.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.users = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
    })
    builder.addCase(getUsers.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * ALl
     */
    builder.addCase(getAllUsers.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.allUsers = action.payload.data
    })
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setCheckedAll } = usersSlice.actions
export default usersSlice.reducer
