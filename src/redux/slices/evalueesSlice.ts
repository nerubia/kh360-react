import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import {
  type EvaluationResults,
  type EvalueeFilters,
} from "../../types/evalueeType"
import { axiosInstance } from "../../utils/axiosInstance"
import { Loading } from "../../types/loadingType"

export const getEvaluees = createAsyncThunk(
  "evaluees/getEvaluees",
  async (params: EvalueeFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/evaluees`, {
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
  evaluation_results?: EvaluationResults[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  evaluation_results: [],
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
}

const evalueesSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // get evaluees
    builder.addCase(getEvaluees.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEvaluees.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_results = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
    })
    builder.addCase(getEvaluees.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default evalueesSlice.reducer
