import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { type User } from "../../types/userType"
import { axiosInstance } from "../../utils/axiosInstance"

export const getEmployees = createAsyncThunk(
  "employees/getEmployees",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstance.get("/employees")
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

interface Employees {
  loading: boolean
  error: string | null
  employees: User[]
}

const initialState: Employees = {
  loading: false,
  error: null,
  employees: [],
}

const employeesSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // list
    builder.addCase(getEmployees.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getEmployees.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.employees = action.payload
    })
    builder.addCase(getEmployees.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

export default employeesSlice.reducer
