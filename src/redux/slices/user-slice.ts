import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { type UserEvaluationsFilter } from "../../types/userType"
import { type Evaluation } from "../../types/evaluationType"
import { type Answers } from "../../types/answer-type"
import {
  type EvaluationAdministration,
  type EvaluationAdministrationFilters,
} from "../../types/evaluationAdministrationType"
import { axiosInstance } from "../../utils/axiosInstance"
import { Loading } from "../../types/loadingType"

export const getUserEvaluations = createAsyncThunk(
  "user/getUserEvaluations",
  async (params: UserEvaluationsFilter | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("user/evaluations", {
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

export const getUserEvaluationAdministrations = createAsyncThunk(
  "user/getUserEvaluationAdministrations",
  async (params: EvaluationAdministrationFilters, thunkApi) => {
    try {
      const response = await axiosInstance.get("/user/evaluation-administrations", {
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

export const submitEvaluation = createAsyncThunk(
  "user/submitEvaluation",
  async (data: Answers, thunkApi) => {
    try {
      const response = await axiosInstance.post(
        `/user/evaluations/${data.evaluation_id}/submit-evaluation`,
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

interface InitialState {
  loading: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  loading_answer: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  loading_comment: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  loading_submit_evaluation: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  user_evaluations: Evaluation[]
  user_evaluation_administrations: EvaluationAdministration[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
  totalItems: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  loading_answer: Loading.Idle,
  loading_comment: Loading.Idle,
  loading_submit_evaluation: Loading.Idle,
  error: null,
  user_evaluations: [],
  user_evaluation_administrations: [],
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
  totalItems: 0,
}

const userSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateEvaluationStatusById: (state, action) => {
      const { id, status, comment } = action.payload

      const index = state.user_evaluations.findIndex((evaluation) => evaluation.id === parseInt(id))

      if (index !== -1) {
        if (comment !== undefined) {
          state.user_evaluations[index].comments = comment
        }
        state.user_evaluations[index].status = status
      }
    },
  },
  extraReducers(builder) {
    /**
     * List user evaluations
     */
    builder.addCase(getUserEvaluations.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getUserEvaluations.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.user_evaluations = action.payload
    })
    builder.addCase(getUserEvaluations.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
      state.user_evaluations = []
    })
    /**
     * List user evaluation administrations
     */
    builder.addCase(getUserEvaluationAdministrations.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getUserEvaluationAdministrations.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.user_evaluation_administrations = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getUserEvaluationAdministrations.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Submit evaluation
     */
    builder.addCase(submitEvaluation.pending, (state) => {
      state.loading_submit_evaluation = Loading.Pending
      state.error = null
    })
    builder.addCase(submitEvaluation.fulfilled, (state) => {
      state.loading_submit_evaluation = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(submitEvaluation.rejected, (state, action) => {
      state.loading_submit_evaluation = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { updateEvaluationStatusById } = userSlice.actions
export default userSlice.reducer
