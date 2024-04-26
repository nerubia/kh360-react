import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { axiosInstance } from "@utils/axios-instance"
import { Loading } from "@custom-types/loadingType"
import { type EvaluationAdministrationFormData } from "@custom-types/form-data-type"
import {
  type EvaluationAdministrationFilters,
  type EvaluationAdministration,
} from "@custom-types/evaluation-administration-type"

export const getEvaluationAdministrations = createAsyncThunk(
  "evaluationAdministration/getEvaluationAdministrations",
  async (params: EvaluationAdministrationFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/evaluation-administrations", {
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

export const getEvaluationAdministrationsSocket = createAsyncThunk(
  "evaluationAdministration/getEvaluationAdministrationsSocket",
  async (params: EvaluationAdministrationFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/evaluation-administrations", {
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

export const createEvaluationAdministration = createAsyncThunk(
  "evaluationAdministration/createEvaluationAdministration",
  async (data: EvaluationAdministrationFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post("/admin/evaluation-administrations", data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const generateEvaluationAdministration = createAsyncThunk(
  "evaluationAdministration/generate",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.post(`/admin/evaluation-administrations/${id}/generate`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const generateUpdate = createAsyncThunk(
  "evaluationAdministration/generateUpdate",
  async (evaluation_result_id: number, thunkApi) => {
    try {
      const response = await axiosInstance.post(
        `/admin/evaluation-administrations/${evaluation_result_id}/generate-update`
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
  currentPage: number
  totalPages: number
  totalItems: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  evaluation_administrations: [],
  hasPreviousPage: false,
  hasNextPage: false,
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,
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
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getEvaluationAdministrations.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List triggered by socket
     */
    builder.addCase(getEvaluationAdministrationsSocket.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_administrations = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
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
    builder.addCase(createEvaluationAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Generate
     */
    builder.addCase(generateEvaluationAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(generateEvaluationAdministration.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(generateEvaluationAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Generate updated records
     */
    builder.addCase(generateUpdate.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(generateUpdate.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(generateUpdate.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default evaluationAdministrationsSlice.reducer
