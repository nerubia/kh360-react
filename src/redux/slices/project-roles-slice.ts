import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { Loading } from "@custom-types/loadingType"
import { axiosInstance } from "@utils/axios-instance"
import { type ProjectRole } from "@custom-types/project-role-type"

export const getProjectRoles = createAsyncThunk(
  "projectRole/getProjectRoles",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/project-roles")
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const getAllProjectRoles = createAsyncThunk(
  "projectRole/getAllProjectRoles",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/project-roles/all")
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
  project_roles: ProjectRole[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  project_roles: [],
}

const projectRolesSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /**
     * List
     */
    builder.addCase(getProjectRoles.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getProjectRoles.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.project_roles = action.payload
    })
    builder.addCase(getProjectRoles.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List all
     */
    builder.addCase(getAllProjectRoles.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getAllProjectRoles.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.project_roles = action.payload
    })
    builder.addCase(getAllProjectRoles.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default projectRolesSlice.reducer
