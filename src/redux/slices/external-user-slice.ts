import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { axiosInstance } from "../../utils/axiosInstance"
import { Loading } from "../../types/loadingType"
import { type ExternalUser } from "../../types/external-user-type"

export const getExternalUser = createAsyncThunk(
  "externalUser/getExternalUser",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/external-users/${id}`)
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
  external_user: ExternalUser | null
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  external_user: null,
}

const externalUserSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setExternalUser: (state, action) => {
      state.external_user = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * Get
     */
    builder.addCase(getExternalUser.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getExternalUser.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.external_user = action.payload
    })
    builder.addCase(getExternalUser.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setExternalUser } = externalUserSlice.actions
export default externalUserSlice.reducer
