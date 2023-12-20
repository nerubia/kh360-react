import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { axiosInstance } from "../../utils/axios-instance"
import { Loading } from "../../types/loadingType"
import { type EvaluationAdministrationFormData } from "../../types/form-data-type"
import {
  type EvaluationAdministrationFilters,
  type EvaluationAdministration,
} from "../../types/evaluation-administration-type"

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

export const getScrollableEvaluationAdministrations = createAsyncThunk(
  "evaluationAdministration/getScrollableEvaluationAdministrations",
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
  "evaluationAdministration/getEvaluationAdministraion",
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

interface InitialState {
  loading: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  evaluation_administrations: EvaluationAdministration[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  currentPage: number
  totalPages: number
  totalItems: number
  previousUrl: string | null
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
  previousUrl: null,
}

const evaluationAdministrationsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setPreviousUrl: (state, action) => {
      state.previousUrl = action.payload
    },
  },
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
     * List (scroll to load more)
     */
    builder.addCase(getScrollableEvaluationAdministrations.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getScrollableEvaluationAdministrations.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      const newData: EvaluationAdministration[] = []
      const payloadData = action.payload.data as EvaluationAdministration[]
      for (const data of payloadData) {
        if (
          !state.evaluation_administrations.some(
            (evaluationAdministration) => evaluationAdministration.id === data.id
          )
        ) {
          newData.push(data)
        }
      }
      state.evaluation_administrations = [...state.evaluation_administrations, ...newData]
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.currentPage = action.payload.pageInfo.currentPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getScrollableEvaluationAdministrations.rejected, (state, action) => {
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
  },
})

export const { setPreviousUrl } = evaluationAdministrationsSlice.actions
export default evaluationAdministrationsSlice.reducer
