import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { type EvaluationAdministration } from "../../types/evaluationAdministrationType"
import { axiosInstance } from "../../utils/axiosInstance"
import { Loading } from "../../types/loadingType"

export const getEvaluation = createAsyncThunk(
  "evaluation/getEvaluation",
  async (id: string, thunkApi) => {
    try {
      const response = await axiosInstance.get(
        `/admin/evaluation-administrations/${id}`
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)
export const updateEvaluation = createAsyncThunk(
  "evaluation/updateEvaluation",
  async (
    data: {
      id: string | undefined
      evaluation_data: EvaluationAdministration
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.put(
        `/admin/evaluation-administrations/${data.id}/update`,
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

export const createEvaluees = createAsyncThunk(
  "evaluation/createEvaluees",
  async (
    data: {
      id: string | undefined
      employee_ids: number[]
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.post(
        `admin/evaluations/${data.id}/evaluees`,
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
  evaluation: EvaluationAdministration | null
  selectedEmployeeIds: number[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  evaluation: null,
  selectedEmployeeIds: [],
}

const evaluationsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSelectedEmployeeIds: (state, action) => {
      state.selectedEmployeeIds = action.payload
    },
  },
  extraReducers(builder) {
    // get
    builder.addCase(getEvaluation.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEvaluation.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation = action.payload
    })
    builder.addCase(getEvaluation.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setSelectedEmployeeIds } = evaluationsSlice.actions
export default evaluationsSlice.reducer
