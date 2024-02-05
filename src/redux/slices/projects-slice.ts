import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { Loading } from "@custom-types/loadingType"
import { axiosInstance } from "@utils/axios-instance"
import { type ProjectFilters, type Project } from "@custom-types/project-type"

export const getAllProjects = createAsyncThunk(
  "project/getAllProjects",
  async (params: ProjectFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/projects/all", {
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

export const getProjects = createAsyncThunk(
  "project/getProjects",
  async (params: ProjectFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/projects", {
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

export const getProjectsOnScroll = createAsyncThunk(
  "project/getProjectsScroll",
  async (params: ProjectFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/projects", {
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

export const getAllProjectStatus = createAsyncThunk(
  "project/getAllProjectStatus",
  async (params: ProjectFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/projects/status", {
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

export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.delete(`/admin/projects/${id}`)
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
  projects: Project[]
  project_statuses: Project[]
  hasPreviousPage: boolean
  currentPage: number
  hasNextPage: boolean
  totalPages: number
  totalItems: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  projects: [],
  project_statuses: [],
  hasPreviousPage: false,
  currentPage: 1,
  hasNextPage: false,
  totalPages: 0,
  totalItems: 0,
}

const projectsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /**
     * List all
     */
    builder.addCase(getAllProjects.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getAllProjects.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.projects = action.payload
    })
    builder.addCase(getAllProjects.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List
     */
    builder.addCase(getProjects.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getProjects.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.projects = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getProjects.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List on scroll
     */
    builder.addCase(getProjectsOnScroll.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getProjectsOnScroll.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      if (action.payload.pageInfo.currentPage > 1) {
        const newData: Project[] = []
        const payloadData = action.payload.data as Project[]
        for (const data of payloadData) {
          if (!state.projects.some((project) => project.id === data.id)) {
            newData.push(data)
          }
        }
        state.projects = payloadData.length > 0 ? [...state.projects, ...newData] : []
      } else {
        state.projects = action.payload.data
      }
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.currentPage = action.payload.pageInfo.currentPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getProjectsOnScroll.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List status
     */
    builder.addCase(getAllProjectStatus.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getAllProjectStatus.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.project_statuses = action.payload
    })
    builder.addCase(getAllProjectStatus.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Delete
     */
    builder.addCase(deleteProject.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(deleteProject.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.projects = state.projects.filter(
        (project) => project.id !== parseInt(action.payload.id)
      )
      state.totalItems = state.totalItems - 1
    })
    builder.addCase(deleteProject.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default projectsSlice.reducer
