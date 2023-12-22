import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { type EvaluationResult } from "../../types/evaluation-result-type"
import { axiosInstance } from "../../utils/axios-instance"
import { Loading } from "../../types/loadingType"
import { type User } from "../../types/user-type"

export const getEvaluationResult = createAsyncThunk(
  "evaluationResult/getEvaluationResult",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/evaluation-results/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const getEvaluators = createAsyncThunk(
  "evaluationResult/getEvaluators",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/evaluation-results/${id}/evaluators`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const setEvaluationResultStatus = createAsyncThunk(
  "evaluationResult/setEvaluationResultStatus",
  async (
    data: {
      id: number
      status: string
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/evaluation-results/${data.id}/set-status`,
        {
          status: data.status,
        }
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response)
    }
  }
)

interface InitialState {
  loading: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  loading_evaluators: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  evaluation_result: EvaluationResult | null
  evaluators: User[]
  previousId?: number
  nextId?: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  loading_evaluators: Loading.Idle,
  error: null,
  evaluation_result: null,
  evaluators: [],
  previousId: undefined,
  nextId: undefined,
}

const evaluationResultSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setEvaluationResult: (state, action) => {
      state.evaluation_result = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * Get evaluation results
     */
    builder.addCase(getEvaluationResult.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEvaluationResult.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_result = action.payload.data
      state.previousId = action.payload.previousId
      state.nextId = action.payload.nextId
    })
    builder.addCase(getEvaluationResult.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Get evaluators
     */
    builder.addCase(getEvaluators.pending, (state) => {
      state.loading_evaluators = Loading.Pending
      state.error = null
    })
    builder.addCase(getEvaluators.fulfilled, (state, action) => {
      state.loading_evaluators = Loading.Fulfilled
      state.error = null
      state.evaluators = action.payload
    })
    builder.addCase(getEvaluators.rejected, (state, action) => {
      state.loading_evaluators = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Set status
     */
    builder.addCase(setEvaluationResultStatus.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(setEvaluationResultStatus.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      if (state.evaluation_result !== null) {
        state.evaluation_result = {
          ...state.evaluation_result,
          status: action.payload.status,
        }
      }
    })
    builder.addCase(setEvaluationResultStatus.rejected, (state, action) => {
      state.loading = Loading.Rejected
      const payload = action.payload as ApiError
      state.error = payload.message
    })
  },
})

export const { setEvaluationResult } = evaluationResultSlice.actions
export default evaluationResultSlice.reducer
