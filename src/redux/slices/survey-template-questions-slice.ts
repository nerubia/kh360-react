import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Loading } from "@custom-types/loadingType"
import { axiosInstance } from "@utils/axios-instance"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { type SurveyTemplateQuestion } from "@custom-types/survey-template-question-type"

export const getSurveyTemplateQuestions = createAsyncThunk(
  "surveyTemplateQuestions/getAll",
  async (params: { survey_template_id: number }, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/survey-template-questions/all", { params })
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
  loading_sort: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  survey_template_questions: SurveyTemplateQuestion[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  loading_sort: Loading.Idle,
  error: null,
  survey_template_questions: [],
}

const surveyTemplateQuestionsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSurveyTemplateQuestions: (state, action) => {
      state.survey_template_questions = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * List all active
     */
    builder.addCase(getSurveyTemplateQuestions.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getSurveyTemplateQuestions.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.survey_template_questions = action.payload
    })
    builder.addCase(getSurveyTemplateQuestions.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setSurveyTemplateQuestions } = surveyTemplateQuestionsSlice.actions
export default surveyTemplateQuestionsSlice.reducer
