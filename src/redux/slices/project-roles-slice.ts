import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { Loading } from "../../types/loadingType"
import { axiosInstance } from "../../utils/axios-instance"
import { type ProjectRole } from "../../types/projectRoleType"

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
  },
})

export default projectRolesSlice.reducer
