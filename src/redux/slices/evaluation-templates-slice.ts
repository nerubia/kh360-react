import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import {
  type EvaluationTemplateFilters,
  type EvaluationTemplate,
} from "../../types/evaluation-template-type"
import { axiosInstance } from "../../utils/axios-instance"
import { Loading } from "../../types/loadingType"

export const getEvaluationTemplates = createAsyncThunk(
  "evaluationTemplate/getEvaluationTemplates",
  async (params: EvaluationTemplateFilters, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/evaluation-templates", {
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
  evaluation_templates: EvaluationTemplate[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  evaluation_templates: [],
}

const evaluationTemplatesSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // list
    builder.addCase(getEvaluationTemplates.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEvaluationTemplates.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_templates = action.payload
    })
    builder.addCase(getEvaluationTemplates.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default evaluationTemplatesSlice.reducer
