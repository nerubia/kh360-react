import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { type User, type EmployeeFilters } from "../../types/userType"
import { axiosInstance } from "../../utils/axiosInstance"
import { Loading } from "../../types/loadingType"

export const getEmployees = createAsyncThunk(
  "employees/getEmployees",
  async (params: EmployeeFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/employees", {
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
  employees: User[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  employees: [],
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
}

const employeesSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // list
    builder.addCase(getEmployees.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEmployees.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.employees = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
    })
    builder.addCase(getEmployees.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default employeesSlice.reducer
