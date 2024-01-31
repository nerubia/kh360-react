import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type Client } from "@custom-types/client-type"
import { Loading } from "@custom-types/loadingType"
import { axiosInstance } from "@utils/axios-instance"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"

export const getActiveClients = createAsyncThunk("clients/listActive", async (_, thunkApi) => {
  try {
    const response = await axiosInstance.get("/admin/clients/active")
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
  clients: Client[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  clients: [],
}

const clientsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /**
     * List active
     */
    builder.addCase(getActiveClients.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getActiveClients.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.clients = action.payload
    })
    builder.addCase(getActiveClients.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default clientsSlice.reducer
