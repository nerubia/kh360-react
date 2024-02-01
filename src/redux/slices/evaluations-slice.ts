import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { type EvaluationFilters, type Evaluation } from "@custom-types/evaluation-type"
import { axiosInstance } from "@utils/axios-instance"
import { Loading } from "@custom-types/loadingType"
import { type EvaluationFormData } from "@custom-types/form-data-type"

export const getEvaluations = createAsyncThunk(
  "evaluations/getEvaluations",
  async (params: EvaluationFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/evaluations", {
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

export const getEvaluationsSocket = createAsyncThunk(
  "evaluations/getEvaluationsSocket",
  async (params: EvaluationFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/evaluations", {
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

export const deleteEvaluation = createAsyncThunk(
  "evaluations/deleteEvaluation",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.delete(`/admin/evaluations/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const setForEvaluations = createAsyncThunk(
  "evaluations/setForEvaluations",
  async (
    data: {
      evaluation_ids: number[]
      for_evaluation: boolean
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.patch("/admin/evaluations/set-for-evaluations", {
        evaluation_ids: data.evaluation_ids,
        for_evaluation: data.for_evaluation,
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const updateProject = createAsyncThunk(
  "evaluations/updateProject",
  async (
    data: {
      id: number
      evaluation_data: EvaluationFormData
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/evaluations/${data.id}`,
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

export const approveRequest = createAsyncThunk(
  "evaluations/approveRequest",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.post(`/admin/evaluations/${id}/approve`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const declineRequest = createAsyncThunk(
  "evaluations/declineRequest",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.post(`/admin/evaluations/${id}/decline`)
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
  evaluations: Evaluation[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  evaluations: [],
}

const evaluationsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /**
     * List
     */
    builder.addCase(getEvaluations.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEvaluations.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluations = action.payload
    })
    builder.addCase(getEvaluations.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List triggered by socket
     */
    builder.addCase(getEvaluationsSocket.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluations = action.payload
    })
    /**
     * Delete
     */
    builder.addCase(deleteEvaluation.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(deleteEvaluation.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluations = state.evaluations.filter(
        (evaluation) => evaluation.id !== parseInt(action.payload.id)
      )
    })
    builder.addCase(deleteEvaluation.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Set for_evaluation
     */
    builder.addCase(setForEvaluations.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(setForEvaluations.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      const employeeIds = action.payload.evaluation_ids as number[]
      state.evaluations = state.evaluations.map((evaluation) =>
        employeeIds.includes(evaluation.id)
          ? {
              ...evaluation,
              for_evaluation: action.payload.for_evaluation,
            }
          : evaluation
      )
    })
    builder.addCase(setForEvaluations.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Update project
     */
    builder.addCase(updateProject.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(updateProject.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluations = state.evaluations.map((evaluation) =>
        evaluation.id === action.payload.id
          ? {
              ...evaluation,
              eval_start_date: action.payload.eval_start_date,
              eval_end_date: action.payload.eval_end_date,
              percent_involvement: action.payload.percent_involvement,
              project: action.payload.project,
            }
          : evaluation
      )
    })
    builder.addCase(updateProject.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Approve Request
     */
    builder.addCase(approveRequest.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(approveRequest.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(approveRequest.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Decline Request
     */
    builder.addCase(declineRequest.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(declineRequest.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(declineRequest.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default evaluationsSlice.reducer
