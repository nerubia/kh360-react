import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { axiosInstance } from "@utils/axios-instance"
import { Loading } from "@custom-types/loadingType"
import {
  type SurveyAdminstration,
  type SurveyAdministrationFilters,
} from "@custom-types/survey-administration-type"

export const getSurveyAdministrations = createAsyncThunk(
  "surveyAdministrations/getSurveyAdministrations",
  async (params: SurveyAdministrationFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/survey-administrations", {
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

export const getSurveyAdministrationsSocket = createAsyncThunk(
  "surveyAdministrations/getSurveyAdministrationsSocket",
  async (params: SurveyAdministrationFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/survey-administrations", {
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
  survey_administrations: SurveyAdminstration[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  currentPage: number
  totalPages: number
  totalItems: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  survey_administrations: [],
  hasPreviousPage: false,
  hasNextPage: false,
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,
}

const surveyAdministrationsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /**
     * List
     */
    builder.addCase(getSurveyAdministrations.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getSurveyAdministrations.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.survey_administrations = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getSurveyAdministrations.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List triggered by socket
     */
    builder.addCase(getSurveyAdministrationsSocket.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.survey_administrations = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
  },
})

export default surveyAdministrationsSlice.reducer
