import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { Loading } from "../../types/loadingType"
import { axiosInstance } from "../../utils/axios-instance"
import { type ProjectFilters, type Project } from "../../types/projectType"

export const getAllProjects = createAsyncThunk(
  "project/getProjects",
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

interface InitialState {
  loading: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  projects: Project[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  projects: [],
}

const projectsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /**
     * List
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
  },
})

export default projectsSlice.reducer
