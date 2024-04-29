import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import {
  type EmailTemplateFilters,
  type EmailTemplate,
  type TemplateTypeOption,
} from "@custom-types/email-template-type"
import { Loading } from "@custom-types/loadingType"
import { axiosInstance } from "@utils/axios-instance"
import { type EmailTemplateFormData } from "@custom-types/form-data-type"
import { type Option } from "@custom-types/optionType"

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

export const getEmailTemplate = createAsyncThunk(
  "emailTemplate/getEmailTemplate",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/email-templates/${id}`)
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

export const getByTemplateTypeSocket = createAsyncThunk(
  "emailTemplate/getByTemplateTypeSocket",
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

export const getTemplateTypes = createAsyncThunk(
  "emailTemplate/getTemplateTypes",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/email-templates/types`)
      response.data.sort((a: TemplateTypeOption, b: TemplateTypeOption) =>
        a.label.normalize().localeCompare(b.label.normalize())
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const createEmailTemplate = createAsyncThunk(
  "emailTemplate/createEmailTemplate",
  async (data: EmailTemplateFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post("/admin/email-templates", data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const updateEmailTemplate = createAsyncThunk(
  "emailTemplate/updateEmailTemplate",
  async (
    data: {
      id: number
      emailTemplate: EmailTemplateFormData
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.put(
        `/admin/email-templates/${data.id}`,
        data.emailTemplate
      )
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
  templateTypes: Option[]
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
  templateTypes: [],
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
  totalItems: 0,
}

const emailTemplateSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setEmailTemplate: (state, action) => {
      state.emailTemplate = action.payload
    },
  },
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
     * By id
     */
    builder.addCase(getEmailTemplate.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEmailTemplate.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.emailTemplate = action.payload
    })
    builder.addCase(getEmailTemplate.rejected, (state, action) => {
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
      state.emailTemplate = null
    })
    /**
     * List all unique email template types
     */
    builder.addCase(getTemplateTypes.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.templateTypes = action.payload
    })
    /**
     * By template type triggered by socket
     */
    builder.addCase(getByTemplateTypeSocket.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.emailTemplate = action.payload
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
     * Create
     */
    builder.addCase(createEmailTemplate.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(createEmailTemplate.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(createEmailTemplate.rejected, (state, action) => {
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

export const { setEmailTemplate } = emailTemplateSlice.actions
export default emailTemplateSlice.reducer
