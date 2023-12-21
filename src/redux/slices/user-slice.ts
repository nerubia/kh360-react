import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { type UserEvaluationsFilter } from "../../types/user-type"
import { type Evaluation } from "../../types/evaluation-type"
import { type Answers } from "../../types/answer-type"
import {
  type EvaluationAdministration,
  type EvaluationAdministrationFilters,
} from "../../types/evaluation-administration-type"
import { axiosInstance } from "../../utils/axios-instance"
import { Loading } from "../../types/loadingType"
import { type EvaluationResult } from "../../types/evaluation-result-type"
import { type ScoreRating } from "../../types/score-rating-type"

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

export const getEvaluationAdministrationsAsEvaluee = createAsyncThunk(
  "user/getEvaluationAdministrationsAsEvaluee",
  async (params: EvaluationAdministrationFilters, thunkApi) => {
    try {
      const response = await axiosInstance.get("/user/my-evaluations", {
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

export const getUserEvaluationResult = createAsyncThunk(
  "user/getUserEvaluationResult",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/user/my-evaluations/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const sendRequestToRemove = createAsyncThunk(
  "user/sendRequestToRemove",
  async (data: Answers, thunkApi) => {
    try {
      const response = await axiosInstance.post(
        `/user/evaluations/${data.evaluation_id}/request-remove`,
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

export const getScoreRatings = createAsyncThunk("user/getScoreRatings", async (_, thunkApi) => {
  try {
    const response = await axiosInstance.get("user/score-ratings")
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response?.data as ApiError
    return thunkApi.rejectWithValue(response.message)
  }
})

interface InitialState {
  loading: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  loading_answer: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  loading_comment: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  loading_submit_evaluation: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  user_evaluations: Evaluation[]
  user_evaluation_administrations: EvaluationAdministration[]
  my_evaluation_administrations: EvaluationAdministration[]
  user_evaluation_result: EvaluationResult | null
  score_ratings: ScoreRating[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  currentPage: number
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
  my_evaluation_administrations: [],
  user_evaluation_result: null,
  score_ratings: [],
  hasPreviousPage: false,
  hasNextPage: false,
  currentPage: 0,
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
    updateTotalEvaluations: (state, action) => {
      const { id } = action.payload

      const index = state.user_evaluation_administrations.findIndex(
        (evaluationAdministration) => evaluationAdministration.id === parseInt(id)
      )
      if (index !== -1) {
        const newTotal = state.user_evaluation_administrations[index].totalEvaluations
        if (newTotal !== undefined) {
          state.user_evaluation_administrations[index].totalEvaluations = newTotal - 1
        }
      }
    },
    updateTotalSubmitted: (state, action) => {
      const { id } = action.payload

      const index = state.user_evaluation_administrations.findIndex(
        (evaluationAdministration) => evaluationAdministration.id === parseInt(id)
      )
      if (index !== -1) {
        const newTotal = state.user_evaluation_administrations[index].totalSubmitted
        if (newTotal !== undefined) {
          state.user_evaluation_administrations[index].totalSubmitted = newTotal + 1
        }
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
      if (action.payload.pageInfo.currentPage > 1) {
        const newData: EvaluationAdministration[] = []
        const payloadData = action.payload.data as EvaluationAdministration[]
        for (const data of payloadData) {
          if (
            !state.user_evaluation_administrations.some(
              (evaluationAdministration) => evaluationAdministration.id === data.id
            )
          ) {
            newData.push(data)
          }
        }
        state.user_evaluation_administrations =
          payloadData.length > 0 ? [...state.user_evaluation_administrations, ...newData] : []
      } else {
        state.user_evaluation_administrations = action.payload.data
      }
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.currentPage = action.payload.pageInfo.currentPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getUserEvaluationAdministrations.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List user evaluation administrations (as evaluee)
     */
    builder.addCase(getEvaluationAdministrationsAsEvaluee.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEvaluationAdministrationsAsEvaluee.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      const newData: EvaluationAdministration[] = []
      const payloadData = action.payload.data as EvaluationAdministration[]
      for (const data of payloadData) {
        if (
          !state.my_evaluation_administrations.some(
            (evaluationAdministration) => evaluationAdministration.id === data.id
          )
        ) {
          newData.push(data)
        }
      }
      state.my_evaluation_administrations = [...state.my_evaluation_administrations, ...newData]
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.currentPage = action.payload.pageInfo.currentPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getEvaluationAdministrationsAsEvaluee.rejected, (state, action) => {
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
    /**
     * Get user evaluation result
     */
    builder.addCase(getUserEvaluationResult.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getUserEvaluationResult.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.user_evaluation_result = action.payload
    })
    builder.addCase(getUserEvaluationResult.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Send request to remove
     */
    builder.addCase(sendRequestToRemove.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(sendRequestToRemove.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(sendRequestToRemove.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List score ratings
     */
    builder.addCase(getScoreRatings.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getScoreRatings.fulfilled, (state, action) => {
      state.score_ratings = action.payload
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(getScoreRatings.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { updateEvaluationStatusById, updateTotalEvaluations, updateTotalSubmitted } =
  userSlice.actions
export default userSlice.reducer
