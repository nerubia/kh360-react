import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { type EvaluationAdministration } from "../../types/evaluationAdministrationType"
import { axiosInstance } from "../../utils/axiosInstance"
import { Loading } from "../../types/loadingType"
import { type EvaluationFormData } from "../../types/formDataType"

export const getEvaluationAdministration = createAsyncThunk(
  "evaluationAdministration/getEvaluationAdministraion",
  async (id: number, thunkApi) => {
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

export const updateEvaluationAdministration = createAsyncThunk(
  "evaluationAdministration/updateEvaluationAdministration",
  async (
    data: {
      id: number
      evaluation_data: EvaluationFormData
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

export const generateStatusEvaluationAdministration = createAsyncThunk(
  "evaluationAdministration/generateStatusEvaluationAdministration",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(
        `/admin/evaluation-administrations/${id}/generate-status`
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
  evaluation_administration: EvaluationAdministration | null
  selectedEmployeeIds: number[]
  canGenerate: boolean
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  evaluation_administration: null,
  selectedEmployeeIds: [],
  canGenerate: false,
}

const evaluationAdministrationSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSelectedEmployeeIds: (state, action) => {
      state.selectedEmployeeIds = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * Get
     */
    builder.addCase(getEvaluationAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEvaluationAdministration.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_administration = action.payload
    })
    builder.addCase(getEvaluationAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Generate status
     */
    builder.addCase(generateStatusEvaluationAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(
      generateStatusEvaluationAdministration.fulfilled,
      (state, action) => {
        state.loading = Loading.Fulfilled
        state.error = null
        state.canGenerate = action.payload.canGenerate
      }
    )
    builder.addCase(
      generateStatusEvaluationAdministration.rejected,
      (state, action) => {
        state.loading = Loading.Rejected
        state.error = action.payload as string
      }
    )
  },
})

export const { setSelectedEmployeeIds } = evaluationAdministrationSlice.actions
export default evaluationAdministrationSlice.reducer
