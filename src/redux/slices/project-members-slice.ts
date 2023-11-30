import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { Loading } from "../../types/loadingType"
import { axiosInstance } from "../../utils/axios-instance"
import { type ProjectMemberFilters, type ProjectMember } from "../../types/project-member-type"

export const getProjectMembers = createAsyncThunk(
  "projectMember/getProjectMembers",
  async (params: ProjectMemberFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/project-members", {
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
  project_members: ProjectMember[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  project_members: [],
}

const projectMembersSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /**
     * Get
     */
    builder.addCase(getProjectMembers.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getProjectMembers.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.project_members = action.payload
    })
    builder.addCase(getProjectMembers.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default projectMembersSlice.reducer
