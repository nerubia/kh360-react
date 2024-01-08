import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { Loading } from "../../types/loadingType"
import { axiosInstance } from "../../utils/axios-instance"
import { type EvaluationTemplate } from "../../types/evaluation-template-type"

export const getEvaluationTemplate = createAsyncThunk(
  "evaluationTemplate/getEvaluationTemplate",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/evaluation-templates/${id}`)
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
  evaluation_template: EvaluationTemplate | null
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
  totalItems: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  evaluation_template: null,
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
  totalItems: 0,
}

const evaluationTemplateSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setEvaluationTemplateContent: (state, action) => {
      const { evaluationTemplateContentId, evaluationTemplateContent } = action.payload

      const index = state.evaluation_template?.evaluationTemplateContents?.findIndex(
        (content) => content.id === evaluationTemplateContentId
      )

      if (index !== -1 && index !== undefined) {
        if (state.evaluation_template?.evaluationTemplateContents !== undefined) {
          state.evaluation_template.evaluationTemplateContents[index] = evaluationTemplateContent
        }
      }
    },
    removeEvaluationTemplateContent: (state, action) => {
      const { evaluationTemplateContentId } = action.payload

      const index = state.evaluation_template?.evaluationTemplateContents?.findIndex(
        (content) => content.id === evaluationTemplateContentId
      )

      if (index !== -1 && index !== undefined) {
        if (state.evaluation_template?.evaluationTemplateContents !== undefined) {
          state.evaluation_template.evaluationTemplateContents.splice(index, 1)
        }
      }
    },
  },
  extraReducers(builder) {
    /**
     * Get
     */
    builder.addCase(getEvaluationTemplate.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEvaluationTemplate.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_template = action.payload
    })
    builder.addCase(getEvaluationTemplate.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setEvaluationTemplateContent, removeEvaluationTemplateContent } =
  evaluationTemplateSlice.actions

export default evaluationTemplateSlice.reducer
