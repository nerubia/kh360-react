import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { type EvaluationResult } from "../../types/evaluationResultType"
import { axiosInstance } from "../../utils/axiosInstance"
import { Loading } from "../../types/loadingType"

export const getEvaluationResult = createAsyncThunk(
  "evaluationResult/getEvaluationResult",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(
        `/admin/evaluation-results/${id}`
      )
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
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

interface InitialState {
  loading: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  evaluation_result: EvaluationResult | null
  previousId?: number
  nextId?: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  evaluation_result: null,
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
     * Get
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
      state.error = action.payload as string
    })
  },
})

export const { setEvaluationResult } = evaluationResultSlice.actions
export default evaluationResultSlice.reducer
