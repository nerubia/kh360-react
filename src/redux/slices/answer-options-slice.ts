import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AnswerOption } from "@custom-types/answer-option-type"
import { Loading } from "@custom-types/loadingType"
import { axiosInstance } from "@utils/axios-instance"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"

export const getAnswerOptionsByType = createAsyncThunk(
  "answerOptions/getAnswerOptionsByType",
  async (answer_name: string, thunkApi) => {
    try {
      const response = await axiosInstance.get("/user/answer-options/active", {
        params: { answer_name },
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
  answer_options: AnswerOption[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  answer_options: [],
}

const answerOptionsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /**
     * List active
     */
    builder.addCase(getAnswerOptionsByType.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getAnswerOptionsByType.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.answer_options = action.payload
    })
    builder.addCase(getAnswerOptionsByType.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default answerOptionsSlice.reducer
