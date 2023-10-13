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

export const getEvaluation = createAsyncThunk(
  "evaluations/get",
  async (id: string, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/evaluations/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const setEvaluators = createAsyncThunk(
  "evaluations/setEvaluators",
  async (
    data: {
      id: string
      employee_ids: number[]
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.post(
        `/evaluations/${data.id}/set-evaluators`,
        data
      )
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
  evaluation: Evaluation | null
  selectedEmployeeIds: number[]
}

const initialState: Evaluations = {
  loading: false,
  error: null,
  evaluations: [],
  evaluation: null,
  selectedEmployeeIds: [],
}

const evaluationsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSelectedEmployeeIds: (state, action) => {
      state.selectedEmployeeIds = action.payload
    },
  },
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
    // get
    builder.addCase(getEvaluation.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getEvaluation.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.evaluation = action.payload
    })
    builder.addCase(getEvaluation.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

export const { setSelectedEmployeeIds } = evaluationsSlice.actions
export default evaluationsSlice.reducer
