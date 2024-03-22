import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {
  SurveyAdministrationStatus,
  type SurveyAdminstration,
} from "@custom-types/survey-administration-type"
import { Loading } from "@custom-types/loadingType"
import { axiosInstance } from "@utils/axios-instance"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { type SurveyAdministrationFormData } from "@custom-types/form-data-type"

export const getSurveyAdministration = createAsyncThunk(
  "surveyAdministration/getSurveyAdministration",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/survey-administrations/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const getSurveyAdministrationSocket = createAsyncThunk(
  "surveyAdministration/getSurveyAdministrationSocket",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/survey-administrations/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const createSurveyAdministration = createAsyncThunk(
  "surveyAdministration/createSurveyAdministration",
  async (data: SurveyAdministrationFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post("/admin/survey-administrations", data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const updateSurveyAdministration = createAsyncThunk(
  "surveyAdministration/updateSurveyAdministration",
  async (
    data: {
      id: number
      skillCategory: SurveyAdministrationFormData
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.put(
        `/admin/survey-administrations/${data.id}`,
        data.skillCategory
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const deleteSurveyAdministration = createAsyncThunk(
  "surveyAdministration/deleteSurveyAdministration",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.delete(`/admin/survey-administrations/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const closeSurveyAdministration = createAsyncThunk(
  "surveyAdministration/close",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.post(`/admin/survey-administrations/${id}/close`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const cancelSurveyAdministration = createAsyncThunk(
  "surveyAdministration/cancel",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.post(`/admin/survey-administrations/${id}/cancel`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const reopenSurveyAdministration = createAsyncThunk(
  "surveyAdministration/reopen",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.post(`/admin/survey-administrations/${id}/reopen`)
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
  survey_administration: SurveyAdminstration | null
  selectedEmployeeIds: number[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  loading_send: Loading.Idle,
  error: null,
  survey_administration: null,
  selectedEmployeeIds: [],
}

const surveyAdministrationSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSelectedEmployeeIds: (state, action) => {
      state.selectedEmployeeIds = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * Get survey administration
     */
    builder.addCase(getSurveyAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getSurveyAdministration.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.survey_administration = action.payload
    })
    builder.addCase(getSurveyAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Get triggered by socket
     */
    builder.addCase(getSurveyAdministrationSocket.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.survey_administration = action.payload
    })
    /**
     * Create
     */
    builder.addCase(createSurveyAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(createSurveyAdministration.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.survey_administration = action.payload
    })
    builder.addCase(createSurveyAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Update
     */
    builder.addCase(updateSurveyAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(updateSurveyAdministration.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.survey_administration = action.payload
    })
    builder.addCase(updateSurveyAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Delete
     */
    builder.addCase(deleteSurveyAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(deleteSurveyAdministration.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(deleteSurveyAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Close
     */
    builder.addCase(closeSurveyAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(closeSurveyAdministration.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
      if (state.survey_administration !== null) {
        state.survey_administration = {
          ...state.survey_administration,
          status: SurveyAdministrationStatus.Closed,
        }
      }
    })
    builder.addCase(closeSurveyAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Cancel
     */
    builder.addCase(cancelSurveyAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(cancelSurveyAdministration.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
      if (state.survey_administration !== null) {
        state.survey_administration = {
          ...state.survey_administration,
          status: SurveyAdministrationStatus.Cancelled,
        }
      }
    })
    builder.addCase(cancelSurveyAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Reopen
     */
    builder.addCase(reopenSurveyAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(reopenSurveyAdministration.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
      if (state.survey_administration !== null) {
        state.survey_administration = {
          ...state.survey_administration,
          status: SurveyAdministrationStatus.Ongoing,
        }
      }
    })
    builder.addCase(reopenSurveyAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setSelectedEmployeeIds } = surveyAdministrationSlice.actions
export default surveyAdministrationSlice.reducer
