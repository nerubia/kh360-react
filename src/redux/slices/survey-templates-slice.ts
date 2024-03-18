import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type SurveyTemplate } from "@custom-types/survey-template-type"
import { Loading } from "@custom-types/loadingType"
import { axiosInstance } from "@utils/axios-instance"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"

export const getAllSurveyTemplates = createAsyncThunk(
  "surveyTemplates/getAll",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/survey-templates/all")
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
  survey_templates: SurveyTemplate[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  loading_sort: Loading.Idle,
  error: null,
  survey_templates: [],
}

const surveyTemplatesSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSurveyTemplates: (state, action) => {
      state.survey_templates = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * List all active
     */
    builder.addCase(getAllSurveyTemplates.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getAllSurveyTemplates.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.survey_templates = action.payload
    })
    builder.addCase(getAllSurveyTemplates.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setSurveyTemplates } = surveyTemplatesSlice.actions
export default surveyTemplatesSlice.reducer
