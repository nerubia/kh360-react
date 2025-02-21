import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import {
  type EvaluationResult,
  type EvaluationResultFilters,
} from "@custom-types/evaluation-result-type"
import { axiosInstance } from "@utils/axios-instance"
import { Loading } from "@custom-types/loadingType"
import { type EvaluationResultsFormData } from "@custom-types/form-data-type"

export const getCmEvaluationResults = createAsyncThunk(
  "evaluationResults/getCmEvaluationResults",
  async (params: EvaluationResultFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/user/evaluation-results`, {
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

export const getEvaluationResults = createAsyncThunk(
  "evaluationResults/getEvaluationResults",
  async (params: EvaluationResultFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/evaluation-results`, {
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

export const createEvaluationResults = createAsyncThunk(
  "evaluationResults/createEvaluationResults",
  async (data: EvaluationResultsFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post(`admin/evaluation-results`, data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const deleteEvaluationResult = createAsyncThunk(
  "evaluationResults/deleteEvaluationResult",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.delete(`/admin/evaluation-results/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const getEvaluationResultIds = createAsyncThunk(
  "evaluationResults/getEvaluationResultIds",
  async (params: EvaluationResultFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/evaluation-results/all`, {
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
  evaluation_results: EvaluationResult[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  currentPage: number
  totalPages: number
  totalItems: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  evaluation_results: [],
  hasPreviousPage: false,
  hasNextPage: false,
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,
}

const evaluationResultsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setEvaluationResults: (state, action) => {
      state.evaluation_results = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * List (cm)
     */
    builder.addCase(getCmEvaluationResults.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getCmEvaluationResults.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_results = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getCmEvaluationResults.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List
     */
    builder.addCase(getEvaluationResults.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEvaluationResults.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_results = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.currentPage = action.payload.pageInfo.currentPage
      state.totalPages = action.payload.pageInfo.totalPages
    })
    builder.addCase(getEvaluationResults.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Delete
     */
    builder.addCase(deleteEvaluationResult.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(deleteEvaluationResult.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_results = state.evaluation_results.filter(
        (evaluationResult) => evaluationResult.id !== parseInt(action.payload.id)
      )
    })
    builder.addCase(deleteEvaluationResult.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List ids
     */
    builder.addCase(getEvaluationResultIds.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEvaluationResultIds.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_results = action.payload
    })
    builder.addCase(getEvaluationResultIds.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setEvaluationResults } = evaluationResultsSlice.actions
export default evaluationResultsSlice.reducer
