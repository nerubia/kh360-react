import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import {
  type EvaluationTemplateContent,
  type EvaluationTemplateContentFilters,
} from "../../types/evaluationTemplateContentType"
import { axiosInstance } from "../../utils/axiosInstance"
import { Loading } from "../../types/loadingType"

export const getEvaluationTemplateContents = createAsyncThunk(
  "evaluationTemplate/getEvaluationTemplateContents",
  async (params: EvaluationTemplateContentFilters, thunkApi) => {
    try {
      const response = await axiosInstance.get(
        "/user/evaluation-template-contents",
        {
          params,
        }
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
  evaluation_template_contents: EvaluationTemplateContent[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  evaluation_template_contents: [],
}

const evaluationTemplateContentsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setEvaluationTemplateContents: (state, action) => {
      state.evaluation_template_contents = action.payload
    },
  },
  extraReducers(builder) {
    // list
    builder.addCase(getEvaluationTemplateContents.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(
      getEvaluationTemplateContents.fulfilled,
      (state, action) => {
        state.loading = Loading.Fulfilled
        state.error = null
        state.evaluation_template_contents = action.payload
      }
    )
    builder.addCase(getEvaluationTemplateContents.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
      state.evaluation_template_contents = []
    })
  },
})

export const { setEvaluationTemplateContents } =
  evaluationTemplateContentsSlice.actions
export default evaluationTemplateContentsSlice.reducer
