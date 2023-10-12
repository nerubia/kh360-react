import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { type Evaluation } from "../../types/evaluationType"
import { axiosInstance } from "../../utils/axiosInstance"

export const getEvaluations = createAsyncThunk(
  "evaluations/list",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstance.get("/evaluations")
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const createEvaluation = createAsyncThunk(
  "evaluations/create",
  async (data: Evaluation, thunkApi) => {
    try {
      const response = await axiosInstance.post("/evaluations/create", data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

interface Evaluations {
  loading: boolean
  error: string | null
  evaluations: Evaluation[]
}

const initialState: Evaluations = {
  loading: false,
  error: null,
  evaluations: [],
}

const evaluationsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // list
    builder.addCase(getEvaluations.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getEvaluations.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.evaluations = action.payload
    })
    builder.addCase(getEvaluations.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
    // create
    builder.addCase(createEvaluation.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(createEvaluation.fulfilled, (state) => {
      state.loading = false
      state.error = null
    })
    builder.addCase(createEvaluation.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

export default evaluationsSlice.reducer
