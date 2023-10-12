import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { type Evaluation } from "../../types/evaluationType"
import { axiosInstance } from "../../utils/axiosInstance"

export const createEvaluation = createAsyncThunk(
  "evaluations/create",
  async (data: Evaluation, thunkApi) => {
    try {
      const response = await axiosInstance.post("/evaluations/create", data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

interface Evaluations {
  loading: boolean
  error: string | null
  evaluations: Evaluation[]
}

const initialState: Evaluations = {
  loading: false,
  error: null,
  evaluations: [],
}

const evaluationsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
})

export default evaluationsSlice.reducer
