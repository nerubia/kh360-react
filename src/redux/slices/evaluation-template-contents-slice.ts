import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import {
  type EvaluationTemplateContent,
  type EvaluationTemplateContentFilters,
} from "../../types/evaluation-template-content-type"
import { axiosInstance } from "../../utils/axios-instance"
import { Loading } from "../../types/loadingType"

export const getEvaluationTemplateContents = createAsyncThunk(
  "evaluationTemplate/getEvaluationTemplateContents",
  async (params: EvaluationTemplateContentFilters, thunkApi) => {
    try {
      const response = await axiosInstance.get("/user/evaluation-template-contents", {
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
  evaluation_template_contents: EvaluationTemplateContent[]
  is_editing: boolean
  create_modal_visible: boolean
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  evaluation_template_contents: [],
  is_editing: false,
  create_modal_visible: false,
}

const evaluationTemplateContentsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsEditing: (state, action) => {
      state.is_editing = action.payload
    },
    showCreateModal: (state, action) => {
      state.create_modal_visible = action.payload
    },
    updateEvaluationRatingById: (state, action) => {
      const {
        evaluationTemplateId,
        answerOptionId,
        ratingSequenceNumber,
        ratingAnswerType,
        ratingComment,
      } = action.payload

      const index = state.evaluation_template_contents.findIndex(
        (template) => template.id === evaluationTemplateId
      )

      if (index !== -1) {
        state.evaluation_template_contents[index].evaluationRating.answer_option_id = answerOptionId
        state.evaluation_template_contents[index].evaluationRating.ratingSequenceNumber =
          ratingSequenceNumber
        state.evaluation_template_contents[index].evaluationRating.ratingAnswerType =
          ratingAnswerType
        state.evaluation_template_contents[index].evaluationRating.comments = ratingComment
      }
    },
    updateEvaluationRatingCommentById: (state, action) => {
      const { evaluationTemplateId, ratingComment } = action.payload

      const index = state.evaluation_template_contents.findIndex(
        (template) => template.id === evaluationTemplateId
      )

      if (index !== -1) {
        state.evaluation_template_contents[index].evaluationRating.comments = ratingComment
      }
    },
    setShowRatingCommentInput: (state, action) => {
      const { evaluationTemplateId, showInput } = action.payload

      const index = state.evaluation_template_contents.findIndex(
        (template) => template.id === evaluationTemplateId
      )

      if (index !== -1) {
        state.evaluation_template_contents[index].evaluationRating.showInputComment = showInput
      }
    },
  },
  extraReducers(builder) {
    // list
    builder.addCase(getEvaluationTemplateContents.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getEvaluationTemplateContents.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.evaluation_template_contents = action.payload
    })
    builder.addCase(getEvaluationTemplateContents.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
      state.evaluation_template_contents = []
    })
  },
})

export const {
  setIsEditing,
  showCreateModal,
  updateEvaluationRatingById,
  updateEvaluationRatingCommentById,
  setShowRatingCommentInput,
} = evaluationTemplateContentsSlice.actions
export default evaluationTemplateContentsSlice.reducer
