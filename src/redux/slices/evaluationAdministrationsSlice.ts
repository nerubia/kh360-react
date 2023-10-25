import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { axiosInstance } from "../../utils/axiosInstance"
import { Loading } from "../../types/loadingType"
import { type EvaluationFormData } from "../../types/formDataType"
import {
  type EvaluationAdministrationFilters,
  type EvaluationAdministration,
} from "../../types/evaluationAdministrationType"

export const getEvaluationAdministrations = createAsyncThunk(
  "evaluationAdministration/getEvaluationAdministrations",
  async (params: EvaluationAdministrationFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get(
        "/admin/evaluation-administrations",
        {
          params,
        }
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const createEvaluationAdministration = createAsyncThunk(
  "evaluationAdministration/createEvaluationAdministration",
  async (data: EvaluationFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post(
        "/admin/evaluation-administrations",
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
  error: string | null
  evaluation_administrations: EvaluationAdministration[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  evaluation_administrations: [],
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
}

const evaluationAdministrationsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /**
     * List
     */
    builder.addCase(getEvaluationAdministrations.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEvaluationAdministrations.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_administrations = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
    })
    builder.addCase(getEvaluationAdministrations.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Create
     */
    builder.addCase(createEvaluationAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(createEvaluationAdministration.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(
      createEvaluationAdministration.rejected,
      (state, action) => {
        state.loading = Loading.Rejected
        state.error = action.payload as string
      }
    )
  },
})

export default evaluationAdministrationsSlice.reducer
