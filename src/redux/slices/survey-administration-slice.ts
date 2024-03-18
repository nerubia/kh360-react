import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type SurveyAdminstration } from "@custom-types/survey-administration-type"
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

interface InitialState {
  loading: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  survey_administration: SurveyAdminstration | null
  selectedEmployeeIds: number[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
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
     * Get skill
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
  },
})

export const { setSelectedEmployeeIds } = surveyAdministrationSlice.actions
export default surveyAdministrationSlice.reducer
