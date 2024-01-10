import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type Answer } from "../../types/answer-type"
import { Loading } from "../../types/loadingType"
import { axiosInstance } from "../../utils/axios-instance"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"

export const getActiveAnswers = createAsyncThunk("answer/listActive", async (_, thunkApi) => {
  try {
    const response = await axiosInstance.get("/admin/answers/active")
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response?.data as ApiError
    return thunkApi.rejectWithValue(response.message)
  }
})

interface InitialState {
  loading: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  answers: Answer[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  answers: [],
}

const answerSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /**
     * List active
     */
    builder.addCase(getActiveAnswers.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getActiveAnswers.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.answers = action.payload
    })
    builder.addCase(getActiveAnswers.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default answerSlice.reducer
