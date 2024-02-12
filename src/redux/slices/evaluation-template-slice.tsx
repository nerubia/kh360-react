import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { Loading } from "@custom-types/loadingType"
import { axiosInstance } from "@utils/axios-instance"
import { type EvaluationTemplate } from "@custom-types/evaluation-template-type"
import { type EvaluationTemplateFormData } from "@custom-types/form-data-type"

export const getEvaluationTemplate = createAsyncThunk(
  "evaluationTemplate/getEvaluationTemplate",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/evaluation-templates/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const updateEvaluationTemplate = createAsyncThunk(
  "evaluationTemplate/updateEvaluationTemplate",
  async (
    data: {
      id: number
      evaluation_template_data: EvaluationTemplateFormData
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.put(
        `/admin/evaluation-templates/${data.id}`,
        data.evaluation_template_data
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
  evaluation_template: EvaluationTemplate | null
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
  totalItems: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  evaluation_template: null,
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
  totalItems: 0,
}

const evaluationTemplateSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setEvaluationTemplate: (state, action) => {
      state.evaluation_template = action.payload
    },
    setEvaluationTemplateContent: (state, action) => {
      const { evaluationTemplateContentId, evaluationTemplateContent } = action.payload

      const index = state.evaluation_template?.evaluationTemplateContents?.findIndex(
        (content) => content.id === evaluationTemplateContentId
      )

      if (index !== -1 && index !== undefined) {
        if (state.evaluation_template?.evaluationTemplateContents !== undefined) {
          state.evaluation_template.evaluationTemplateContents[index] = evaluationTemplateContent
        }
      }
    },
    removeEvaluationTemplateContent: (state, action) => {
      const { evaluationTemplateContentId } = action.payload

      const index = state.evaluation_template?.evaluationTemplateContents?.findIndex(
        (content) => content.id === evaluationTemplateContentId
      )

      if (index !== -1 && index !== undefined) {
        if (state.evaluation_template?.evaluationTemplateContents !== undefined) {
          state.evaluation_template.evaluationTemplateContents.splice(index, 1)
        }
      }
    },
    addEvaluationTemplateContent: (state, action) => {
      state.evaluation_template?.evaluationTemplateContents?.push(action.payload)
    },
  },
  extraReducers(builder) {
    /**
     * Get
     */
    builder.addCase(getEvaluationTemplate.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEvaluationTemplate.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_template = action.payload
    })
    builder.addCase(getEvaluationTemplate.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Update
     */
    builder.addCase(updateEvaluationTemplate.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(updateEvaluationTemplate.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_template = action.payload
    })
    builder.addCase(updateEvaluationTemplate.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const {
  setEvaluationTemplate,
  setEvaluationTemplateContent,
  removeEvaluationTemplateContent,
  addEvaluationTemplateContent,
} = evaluationTemplateSlice.actions

export default evaluationTemplateSlice.reducer
