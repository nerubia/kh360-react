import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import {
  type EvaluationTemplateFilters,
  type EvaluationTemplate,
} from "../../types/evaluation-template-type"
import { axiosInstance } from "../../utils/axios-instance"
import { Loading } from "../../types/loadingType"
import { type EvaluationTemplateFormData } from "../../types/form-data-type"

export const createEvaluationTemplate = createAsyncThunk(
  "evaluationTemplate/createEvaluationTemplate",
  async (data: EvaluationTemplateFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post("/admin/evaluation-templates", data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

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

export const getActiveTemplates = createAsyncThunk(
  "evaluationTemplate/getActiveTemplates",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/evaluation-templates/active")
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const getTemplateTypes = createAsyncThunk(
  "evaluationTemplate/getTemplateTypes",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/evaluation-templates/template-types")
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const deleteEvaluationTemplate = createAsyncThunk(
  "evaluationTemplate/deleteEvaluationTemplate",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.delete(`/admin/evaluation-templates/${id}`)
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
  template_types: EvaluationTemplate[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
  totalItems: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  evaluation_templates: [],
  template_types: [],
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
  totalItems: 0,
}

const evaluationTemplatesSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /**
     * Create
     */
    builder.addCase(createEvaluationTemplate.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(createEvaluationTemplate.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(createEvaluationTemplate.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List
     */
    builder.addCase(getEvaluationTemplates.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEvaluationTemplates.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      if (action.payload.pageInfo !== undefined) {
        state.evaluation_templates = action.payload.data
        state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
        state.hasNextPage = action.payload.pageInfo.hasNextPage
        state.totalPages = action.payload.pageInfo.totalPages
        state.totalItems = action.payload.pageInfo.totalItems
      } else {
        state.evaluation_templates = action.payload
      }
    })
    builder.addCase(getEvaluationTemplates.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List active
     */
    builder.addCase(getActiveTemplates.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getActiveTemplates.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_templates = action.payload
    })
    builder.addCase(getActiveTemplates.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List template types
     */
    builder.addCase(getTemplateTypes.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getTemplateTypes.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.template_types = action.payload
    })
    builder.addCase(getTemplateTypes.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Delete
     */
    builder.addCase(deleteEvaluationTemplate.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(deleteEvaluationTemplate.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_templates = state.evaluation_templates.filter(
        (evaluationTemplate) => evaluationTemplate.id !== parseInt(action.payload.id)
      )
      state.totalItems = state.totalItems - 1
    })
    builder.addCase(deleteEvaluationTemplate.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default evaluationTemplatesSlice.reducer
