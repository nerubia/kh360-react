import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { axiosInstance } from "@utils/axios-instance"
import { Loading } from "@custom-types/loadingType"
import { type ProjectMember } from "@custom-types/project-member-type"
import { type ProjectMemberFormData } from "@custom-types/form-data-type"

export const getProjectMember = createAsyncThunk(
  "projectMember/getProjectMember",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/project-members/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const updateProjectMember = createAsyncThunk(
  "projectMember/updateProjectMember",
  async (
    data: {
      id: number
      project_member: ProjectMemberFormData
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.put(
        `/admin/project-members/${data.id}`,
        data.project_member
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
  project_member: ProjectMember | null
  projectMemberFormData: ProjectMemberFormData | null
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  project_member: null,
  projectMemberFormData: {
    project_id: "",
    user_id: "",
    project_name: "",
    project_member_name: "",
    project_role_id: "",
    start_date: "",
    end_date: "",
    allocation_rate: "",
    remarks: "",
    skill_ids: [],
  },
}

const projectMemberSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setProjectMember: (state, action) => {
      state.project_member = action.payload
    },
    setProjectMemberFormData: (state, action) => {
      state.projectMemberFormData = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * Get
     */
    builder.addCase(getProjectMember.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getProjectMember.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.project_member = action.payload
    })
    builder.addCase(getProjectMember.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Update
     */
    builder.addCase(updateProjectMember.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(updateProjectMember.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.project_member = action.payload
    })
    builder.addCase(updateProjectMember.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setProjectMemberFormData, setProjectMember } = projectMemberSlice.actions
export default projectMemberSlice.reducer
