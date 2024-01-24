import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { axiosInstance } from "../../utils/axios-instance"
import { Loading } from "../../types/loadingType"
import { type Project } from "../../types/project-type"
import { type ProjectFormData } from "../../types/form-data-type"

export const getProject = createAsyncThunk("project/getProject", async (id: number, thunkApi) => {
  try {
    const response = await axiosInstance.get(`/admin/projects/${id}`)
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response?.data as ApiError
    return thunkApi.rejectWithValue(response.message)
  }
})

export const createProject = createAsyncThunk(
  "project/createProject",
  async (data: ProjectFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post("/admin/projects", data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const updateProject = createAsyncThunk(
  "project/updateProject",
  async (
    data: {
      id: number
      project: ProjectFormData
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.put(`/admin/projects/${data.id}`, data.project)
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
  project: Project | null
  projectFormData: ProjectFormData
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  project: null,
  projectFormData: {
    name: "",
    client_id: "",
    start_date: "",
    end_date: "",
    description: "",
    status: "",
    skill_ids: [],
  },
}

const projectSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.project = action.payload
    },
    setProjectFormData: (state, action) => {
      state.projectFormData = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * Get
     */
    builder.addCase(getProject.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getProject.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.project = action.payload
    })
    builder.addCase(getProject.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setProject, setProjectFormData } = projectSlice.actions
export default projectSlice.reducer
