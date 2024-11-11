import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { Loading } from "@custom-types/loadingType"
import { axiosInstance } from "@utils/axios-instance"
import {
  type ProjectMemberFilters,
  type ProjectMember,
  type SearchProjectMemberFilters,
} from "@custom-types/project-member-type"
import { type ProjectMemberFormData } from "@custom-types/form-data-type"

export const searchProjectMembers = createAsyncThunk(
  "projectMember/searchProjectMembers",
  async (params: SearchProjectMemberFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/project-members/search", {
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

export const createProjectMember = createAsyncThunk(
  "projectMember/createProjectMember",
  async (data: ProjectMemberFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post("/admin/project-members", data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const deleteProjectMember = createAsyncThunk(
  "projectMember/deleteProjectMember",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.delete(`/admin/project-members/${id}`)
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
     * Search
     */
    builder.addCase(searchProjectMembers.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(searchProjectMembers.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.project_members = action.payload
    })
    builder.addCase(searchProjectMembers.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
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
    /**
     * Create
     */
    builder.addCase(createProjectMember.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(createProjectMember.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(createProjectMember.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Delete
     */
    builder.addCase(deleteProjectMember.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(deleteProjectMember.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.project_members = state.project_members.filter(
        (projectMember) => projectMember.id !== parseInt(action.payload.id)
      )
    })
    builder.addCase(deleteProjectMember.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default projectMembersSlice.reducer
