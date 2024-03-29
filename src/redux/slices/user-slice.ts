import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { type UserEvaluationsFilter, type UserQuestionsFilter } from "@custom-types/user-type"
import { type Evaluation } from "@custom-types/evaluation-type"
import { type Answers } from "@custom-types/answers-type"
import { type SurveyAnswer, type SurveyAnswers } from "@custom-types/survey-answer-type"
import {
  type EvaluationAdministration,
  type EvaluationAdministrationFilters,
} from "@custom-types/evaluation-administration-type"
import { axiosInstance } from "@utils/axios-instance"
import { Loading } from "@custom-types/loadingType"
import { type EvaluationResult } from "@custom-types/evaluation-result-type"
import {
  type SurveyAdminstration,
  type SurveyAdministrationFilters,
} from "@custom-types/survey-administration-type"
import { type SurveyTemplateQuestion } from "@custom-types/survey-template-question-type"

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

export const getUserSurveyAdministrations = createAsyncThunk(
  "surveyAdministrations/getUserSurveyAdministrations",
  async (params: SurveyAdministrationFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/user/survey-administrations", {
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

export const getUserSurveyQuestions = createAsyncThunk(
  "user/getUserSurveyQuestions",
  async (params: UserQuestionsFilter | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("user/survey-questions", {
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

export const submitSurveyAnswers = createAsyncThunk(
  "user/submitSurveyAnswers",
  async (data: SurveyAnswers, thunkApi) => {
    try {
      const response = await axiosInstance.post(
        `/user/survey-administrations/${data.survey_administration_id}/submit-survey`,
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

export const getUserEvaluationAdministrationsSocket = createAsyncThunk(
  "user/getUserEvaluationAdministrationsSocket",
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

interface InitialState {
  loading: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  loading_answer: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  loading_comment: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  loading_submit_evaluation: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  user_evaluations: Evaluation[]
  user_evaluation_administrations: EvaluationAdministration[]
  user_survey_administrations: SurveyAdminstration[]
  user_survey_questions: SurveyTemplateQuestion[]
  user_survey_answers: SurveyAnswer[]
  survey_result_status: string | null
  my_evaluation_administrations: EvaluationAdministration[]
  user_evaluation_result: EvaluationResult | null
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
  user_survey_administrations: [],
  user_survey_questions: [],
  user_survey_answers: [],
  survey_result_status: null,
  my_evaluation_administrations: [],
  user_evaluation_result: null,
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
    updateSurveyResultStatus: (state, action) => {
      state.survey_result_status = action.payload
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
     * List user evaluation administrations triggered by socket
     */
    builder.addCase(getUserEvaluationAdministrationsSocket.fulfilled, (state, action) => {
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
     * List user survey administrations
     */
    builder.addCase(getUserSurveyAdministrations.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getUserSurveyAdministrations.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.user_survey_administrations = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getUserSurveyAdministrations.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Get user survey questions
     */
    builder.addCase(getUserSurveyQuestions.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getUserSurveyQuestions.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.user_survey_questions = action.payload.survey_template_questions
      state.user_survey_administrations = [action.payload.survey_administration]
      state.survey_result_status = action.payload.survey_result_status
      state.user_survey_answers = action.payload.survey_answers
    })
    builder.addCase(getUserSurveyQuestions.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const {
  updateEvaluationStatusById,
  updateTotalEvaluations,
  updateTotalSubmitted,
  updateSurveyResultStatus,
} = userSlice.actions
export default userSlice.reducer
