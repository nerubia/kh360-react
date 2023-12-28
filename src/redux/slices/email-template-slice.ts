import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { type EmailTemplateFilters, type EmailTemplate } from "../../types/email-template-type"
import { Loading } from "../../types/loadingType"
import { axiosInstance } from "../../utils/axios-instance"

export const getEmailTemplates = createAsyncThunk(
  "emailTemplate/getEmailTemplates",
  async (params: EmailTemplateFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/email-templates`, {
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

export const getDefaultEmailTemplate = createAsyncThunk(
  "emailTemplate/getDefaultEmailTemplate",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/email-templates/default`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const getByTemplateType = createAsyncThunk(
  "emailTemplate/getByTemplateType",
  async (template_type: string, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/user/email-templates`, {
        params: {
          template_type,
        },
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const getRatingTemplates = createAsyncThunk(
  "emailTemplate/getRatingTemplates",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/user/rating-templates`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const deleteEmailTemplate = createAsyncThunk(
  "emailTemplate/deleteEmailTemplate",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.delete(`/admin/email-templates/${id}`)
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
  emailTemplates: EmailTemplate[]
  emailTemplate: EmailTemplate | null
  ratingTemplates: EmailTemplate[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
  totalItems: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  emailTemplate: null,
  emailTemplates: [],
  ratingTemplates: [],
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
  totalItems: 0,
}

const emailTemplateSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /**
     * Default email template
     */
    builder.addCase(getDefaultEmailTemplate.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getDefaultEmailTemplate.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.emailTemplate = action.payload
    })
    builder.addCase(getDefaultEmailTemplate.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List email templates
     */
    builder.addCase(getEmailTemplates.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEmailTemplates.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.emailTemplates = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getEmailTemplates.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * By template type
     */
    builder.addCase(getByTemplateType.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getByTemplateType.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.emailTemplate = action.payload
    })
    builder.addCase(getByTemplateType.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Rating message templates
     */
    builder.addCase(getRatingTemplates.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getRatingTemplates.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.ratingTemplates = action.payload
    })
    builder.addCase(getRatingTemplates.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Delete
     */
    builder.addCase(deleteEmailTemplate.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(deleteEmailTemplate.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.emailTemplates = state.emailTemplates?.filter(
        (template) => template.id !== parseInt(action.payload.id)
      )
      state.totalItems = state.totalItems - 1
    })
    builder.addCase(deleteEmailTemplate.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default emailTemplateSlice.reducer
