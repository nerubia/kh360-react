import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { type SurveyResult, type SurveyResultFilters } from "@custom-types/survey-result-type"
import { axiosInstance } from "@utils/axios-instance"
import { Loading } from "@custom-types/loadingType"
import { type SurveyResultsFormData } from "@custom-types/form-data-type"
import { type SendReminderData } from "@custom-types/evaluation-administration-type"

export const getSurveyResults = createAsyncThunk(
  "surveyResults/getSurveyResults",
  async (params: SurveyResultFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/survey-results/all`, {
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

export const createSurveyResults = createAsyncThunk(
  "surveyResults/createSurveyResults",
  async (data: SurveyResultsFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post(`/admin/survey-results`, data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const sendReminder = createAsyncThunk(
  "surveyResults/sendReminder",
  async (data: SendReminderData, thunkApi) => {
    try {
      const response = await axiosInstance.post(
        `/admin/survey-results/${data.id}/send-reminder`,
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
  loading_send: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  survey_results: SurveyResult[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
  totalItems: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  loading_send: Loading.Idle,
  error: null,
  survey_results: [],
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
  totalItems: 0,
}

const surveyResultsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSurveyResults: (state, action) => {
      state.survey_results = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * List selected
     */
    builder.addCase(getSurveyResults.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getSurveyResults.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.survey_results = action.payload
    })
    builder.addCase(getSurveyResults.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Create survey results
     */
    builder.addCase(createSurveyResults.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(createSurveyResults.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(createSurveyResults.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Send reminder
     */
    builder.addCase(sendReminder.pending, (state) => {
      state.loading_send = Loading.Pending
      state.error = null
    })
    builder.addCase(sendReminder.fulfilled, (state, action) => {
      state.loading_send = Loading.Fulfilled
      const index = state.survey_results.findIndex(
        (respondent) => respondent.users?.id === parseInt(action.payload.respondentId)
      )
      if (index !== -1) {
        const newEmailLog = action.payload.emailLog
        if (newEmailLog !== undefined) {
          state.survey_results[index].email_logs?.push(newEmailLog)
        }
      }
      state.error = null
    })
    builder.addCase(sendReminder.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setSurveyResults } = surveyResultsSlice.actions
export default surveyResultsSlice.reducer
