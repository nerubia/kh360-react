import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import {
  type ExternalEvaluator,
  type ExternalEvaluatorFilters,
} from "../../types/external-evaluator-type"
import { axiosInstance } from "../../utils/axiosInstance"
import { Loading } from "../../types/loadingType"

export const getExternalEvaluators = createAsyncThunk(
  "admin/getExternalEvaluators",
  async (params: ExternalEvaluatorFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/external-users", {
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
  external_evaluators: ExternalEvaluator[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
  totalItems: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  external_evaluators: [],
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
  totalItems: 0,
}

const externalEvaluatorsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /**
     * List external evaluators
     */
    builder.addCase(getExternalEvaluators.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getExternalEvaluators.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.external_evaluators = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getExternalEvaluators.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
      state.external_evaluators = []
    })
  },
})

export default externalEvaluatorsSlice.reducer
