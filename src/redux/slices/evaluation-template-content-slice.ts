import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { axiosInstance } from "../../utils/axios-instance"
import { Loading } from "../../types/loadingType"
import { type ExternalUser } from "../../types/external-user-type"
import { type EvaluationTemplateContentFormData } from "../../types/form-data-type"
import { type EvaluationTemplateContent } from "../../types/evaluation-template-content-type"

export const createEvaluationTemplateContent = createAsyncThunk(
  "evaluationTemplate/createEvaluationTemplateContent",
  async (data: EvaluationTemplateContentFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post("/admin/evaluation-template-contents", data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const updateEvaluationTemplateContent = createAsyncThunk(
  "evaluationTemplateContent/updateEvaluationTemplateContent",
  async (
    data: {
      id: number
      evaluation_template_contents_data: EvaluationTemplateContentFormData
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.put(
        `/admin/evaluation-template-contents/${data.id}`,
        data.evaluation_template_contents_data
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const deleteEvaluationTemplateContent = createAsyncThunk(
  "evaluationTemplateContent/deleteEvaluationTemplateContent",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.delete(`/admin/evaluation-template-contents/${id}`)
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
  evaluation_template_content: EvaluationTemplateContent | null
  external_user: ExternalUser | null
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  evaluation_template_content: null,
  external_user: null,
}

const evaluationTemplateContentSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /**
     * Create
     */
    builder.addCase(createEvaluationTemplateContent.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(createEvaluationTemplateContent.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_template_content = action.payload
    })
    builder.addCase(createEvaluationTemplateContent.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Destroy
     */
    builder.addCase(deleteEvaluationTemplateContent.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(deleteEvaluationTemplateContent.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(deleteEvaluationTemplateContent.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default evaluationTemplateContentSlice.reducer
