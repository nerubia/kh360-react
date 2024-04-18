import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import {
  type SendReminderData,
  type EvaluationAdministration,
  type ExternalEvaluatorData,
  type ReopenData,
  EvaluationAdministrationStatus,
} from "@custom-types/evaluation-administration-type"
import { axiosInstance } from "@utils/axios-instance"
import { Loading } from "@custom-types/loadingType"
import {
  type EvaluatorFormData,
  type EvaluationAdministrationFormData,
} from "@custom-types/form-data-type"
import { type User } from "@custom-types/user-type"

export const getEvaluationAdministration = createAsyncThunk(
  "evaluationAdministration/getEvaluationAdministraion",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/evaluation-administrations/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const getEvaluationAdministrationSocket = createAsyncThunk(
  "evaluationAdministration/getEvaluationAdministrationSocket",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/evaluation-administrations/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const updateEvaluationAdministration = createAsyncThunk(
  "evaluationAdministration/updateEvaluationAdministration",
  async (
    data: {
      id: number
      evaluation_data: EvaluationAdministrationFormData
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.put(
        `/admin/evaluation-administrations/${data.id}`,
        data.evaluation_data
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const generateStatusEvaluationAdministration = createAsyncThunk(
  "evaluationAdministration/generateStatusEvaluationAdministration",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(
        `/admin/evaluation-administrations/${id}/generate-status`
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const deleteEvaluationAdministration = createAsyncThunk(
  "evaluationAdministration/delete",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.delete(`/admin/evaluation-administrations/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const cancelEvaluationAdministration = createAsyncThunk(
  "evaluationAdministration/cancel",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.post(`/admin/evaluation-administrations/${id}/cancel`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const closeEvaluationAdministration = createAsyncThunk(
  "evaluationAdministration/close",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.post(`/admin/evaluation-administrations/${id}/close`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const publishEvaluationAdministration = createAsyncThunk(
  "evaluationAdministration/publish",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.post(`/admin/evaluation-administrations/${id}/publish`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const reopenEvaluationAdministration = createAsyncThunk(
  "evaluationAdministration/reopen",
  async ({ id, endDate }: ReopenData, thunkApi) => {
    try {
      const response = await axiosInstance.post(`/admin/evaluation-administrations/${id}/reopen`, {
        eval_end_date: endDate,
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const addExternalEvaluators = createAsyncThunk(
  "evaluationAdministration/addExternalEvaluators",
  async (data: ExternalEvaluatorData, thunkApi) => {
    try {
      const response = await axiosInstance.post(
        `/admin/evaluation-administrations/${data.id}/add-external-evaluators`,
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

export const getEvaluators = createAsyncThunk(
  "evaluationAdministration/getEvaluators",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/evaluation-administrations/${id}/evaluators`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const getEvaluatorsSocket = createAsyncThunk(
  "evaluationAdministration/getEvaluatorsSocket",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/evaluation-administrations/${id}/evaluators`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const addEvaluator = createAsyncThunk(
  "evaluationAdministration/addEvaluator",
  async (data: EvaluatorFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post(
        `/admin/evaluation-administrations/${data.id}/evaluators`,
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

export const sendReminder = createAsyncThunk(
  "evaluationAdministration/sendReminder",
  async (data: SendReminderData, thunkApi) => {
    try {
      const response = await axiosInstance.post(
        `/admin/evaluation-administrations/${data.id}/send-reminder`,
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
  loading_evaluators: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  loading_send: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  evaluation_administration: EvaluationAdministration | null
  evaluators: User[]
  selectedEmployeeIds: number[]
  selectedExternalUserIds: number[]
  canGenerate: boolean
}

const initialState: InitialState = {
  loading: Loading.Idle,
  loading_evaluators: Loading.Idle,
  loading_send: Loading.Idle,
  error: null,
  evaluation_administration: null,
  evaluators: [],
  selectedEmployeeIds: [],
  selectedExternalUserIds: [],
  canGenerate: false,
}

const evaluationAdministrationSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSelectedEmployeeIds: (state, action) => {
      state.selectedEmployeeIds = action.payload
    },
    setSelectedExternalUserIds: (state, action) => {
      state.selectedExternalUserIds = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * Get
     */
    builder.addCase(getEvaluationAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEvaluationAdministration.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_administration = action.payload
    })
    builder.addCase(getEvaluationAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Get triggered by socket
     */
    builder.addCase(getEvaluationAdministrationSocket.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_administration = action.payload
    })
    /**
     * Generate status
     */
    builder.addCase(generateStatusEvaluationAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(generateStatusEvaluationAdministration.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.canGenerate = action.payload.canGenerate
    })
    builder.addCase(generateStatusEvaluationAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Cancel
     */
    builder.addCase(cancelEvaluationAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(cancelEvaluationAdministration.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(cancelEvaluationAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Delete
     */
    builder.addCase(deleteEvaluationAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(deleteEvaluationAdministration.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(deleteEvaluationAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Close
     */
    builder.addCase(closeEvaluationAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(closeEvaluationAdministration.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(closeEvaluationAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Publish
     */
    builder.addCase(publishEvaluationAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(publishEvaluationAdministration.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(publishEvaluationAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Reopen
     */
    builder.addCase(reopenEvaluationAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(reopenEvaluationAdministration.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
      if (state.evaluation_administration !== null) {
        state.evaluation_administration = {
          ...state.evaluation_administration,
          status: EvaluationAdministrationStatus.Ongoing,
        }
      }
    })
    builder.addCase(reopenEvaluationAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Get evaluators
     */
    builder.addCase(getEvaluators.pending, (state) => {
      state.loading_evaluators = Loading.Pending
      state.error = null
    })
    builder.addCase(getEvaluators.fulfilled, (state, action) => {
      state.loading_evaluators = Loading.Fulfilled
      state.error = null
      state.evaluators = action.payload
    })
    builder.addCase(getEvaluators.rejected, (state, action) => {
      state.loading_evaluators = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Get evaluators triggered by socket
     */
    builder.addCase(getEvaluatorsSocket.fulfilled, (state, action) => {
      state.loading_evaluators = Loading.Fulfilled
      state.error = null
      state.evaluators = action.payload
    })
    /**
     * Add evaluator
     */
    builder.addCase(addEvaluator.pending, (state) => {
      state.loading_evaluators = Loading.Pending
      state.error = null
    })
    builder.addCase(addEvaluator.fulfilled, (state) => {
      state.loading_evaluators = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(addEvaluator.rejected, (state, action) => {
      state.loading_evaluators = Loading.Rejected
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
      const index = state.evaluators.findIndex(
        (evaluator) => evaluator.id === parseInt(action.payload.evaluatorId)
      )
      if (index !== -1) {
        const newEmailLog = action.payload.emailLog
        if (newEmailLog !== undefined) {
          state.evaluators[index].email_logs?.push(newEmailLog)
        }
      }
      state.error = null
    })
    builder.addCase(sendReminder.rejected, (state, action) => {
      state.loading_send = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setSelectedEmployeeIds, setSelectedExternalUserIds } =
  evaluationAdministrationSlice.actions
export default evaluationAdministrationSlice.reducer
