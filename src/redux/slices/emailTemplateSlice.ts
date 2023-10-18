import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { type EmailTemplate } from "../../types/emailTemplateType"
import { Loading } from "../../types/loadingType"
import { axiosInstance } from "../../utils/axiosInstance"

export const getDefaultEmailTemplate = createAsyncThunk(
  "emailTemplate/getDefaultEmailTemplate",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/email/templates/default`)
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
  emailTemplate: EmailTemplate | null
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  emailTemplate: null,
}

const emailTemplateSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // get
    builder.addCase(getDefaultEmailTemplate.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getDefaultEmailTemplate.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.emailTemplate = action.payload
    })
    builder.addCase(getDefaultEmailTemplate.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default emailTemplateSlice.reducer
