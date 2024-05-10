import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import {
  type SkillMapResult,
  type SkillMapResultFilters,
} from "@custom-types/skill-map-result-type"
import { axiosInstance } from "@utils/axios-instance"
import { Loading } from "@custom-types/loadingType"
import { type SkillMapResultsFormData } from "@custom-types/form-data-type"
import { type SendReminderData } from "@custom-types/evaluation-administration-type"

export const getSkillMapResults = createAsyncThunk(
  "skillMapResults/getSkillMapResults",
  async (params: SkillMapResultFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/skill-map-results/all`, {
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

export const createSkillMapResults = createAsyncThunk(
  "skillMapResults/createSkillMapResults",
  async (data: SkillMapResultsFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post(`/admin/skill-map-results`, data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const sendReminder = createAsyncThunk(
  "skillMapResults/sendReminder",
  async (data: SendReminderData, thunkApi) => {
    try {
      const response = await axiosInstance.post(
        `/admin/skill-map-results/${data.id}/send-reminder`,
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

export const deleteSkillMapResult = createAsyncThunk(
  "skillMapResults/deleteSkillMapResult",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.delete(`/admin/skill-map-results/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const reopenSkillMapResult = createAsyncThunk(
  "skillMapResults/reopenSkillMapResult",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.post(`/admin/skill-map-results/${id}/reopen`)
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
  skill_map_results: SkillMapResult[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
  totalItems: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  loading_send: Loading.Idle,
  error: null,
  skill_map_results: [],
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
  totalItems: 0,
}

const skillMapResultsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSkillMapResults: (state, action) => {
      state.skill_map_results = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * List results
     */
    builder.addCase(getSkillMapResults.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getSkillMapResults.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.skill_map_results = action.payload
    })
    builder.addCase(getSkillMapResults.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Create skill map results
     */
    builder.addCase(createSkillMapResults.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(createSkillMapResults.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(createSkillMapResults.rejected, (state, action) => {
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
      const index = state.skill_map_results.findIndex(
        (result) => result.users?.id === parseInt(action.payload.respondentId)
      )
      if (index !== -1) {
        const newEmailLog = action.payload.emailLog
        if (newEmailLog !== undefined) {
          state.skill_map_results[index].email_logs?.push(newEmailLog)
        }
      }
      state.error = null
    })
    builder.addCase(sendReminder.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Delete
     */
    builder.addCase(deleteSkillMapResult.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(deleteSkillMapResult.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null

      const deletedIds: number[] = action.payload.deletedIds.map((id: string) => parseInt(id))

      state.skill_map_results = state.skill_map_results?.filter(
        (result) => !deletedIds.includes(result.id)
      )
    })
    builder.addCase(deleteSkillMapResult.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Reopen skill map result
     */
    builder.addCase(reopenSkillMapResult.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(reopenSkillMapResult.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null

      const index = state.skill_map_results.findIndex(
        (result) => result.id === parseInt(action.payload.id)
      )

      if (index !== -1) {
        state.skill_map_results[index].status = action.payload.status
      }
    })
    builder.addCase(reopenSkillMapResult.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setSkillMapResults } = skillMapResultsSlice.actions
export default skillMapResultsSlice.reducer
