import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { Loading } from "@custom-types/loadingType"
import { axiosInstance } from "@utils/axios-instance"
import { type Skill, type SkillFilters } from "@custom-types/skill-type"

export const getProjectSkills = createAsyncThunk(
  "projectSkills/getProjectSkills",
  async (params: SkillFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/project-skills", {
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
  project_skills: Skill[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
  totalItems: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  project_skills: [],
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
  totalItems: 0,
}

const projectSkillsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setProjectSkills: (state, action) => {
      state.project_skills = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * List
     */
    builder.addCase(getProjectSkills.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getProjectSkills.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.project_skills = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getProjectSkills.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setProjectSkills } = projectSkillsSlice.actions
export default projectSkillsSlice.reducer
