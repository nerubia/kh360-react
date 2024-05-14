import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { axiosInstance } from "@utils/axios-instance"
import { Loading } from "@custom-types/loadingType"
import { type Skill, type SkillFilters } from "@custom-types/skill-type"

export const getSkills = createAsyncThunk(
  "skills/getSkills",
  async (params: SkillFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/user/skills", {
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
  skills: Skill[]
  selectedSkills: Skill[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
  totalItems: number
  checkedSkills: Skill[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  skills: [],
  selectedSkills: [],
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
  totalItems: 0,
  checkedSkills: [],
}

const skillsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSkills: (state, action) => {
      state.skills = action.payload
    },
    setSelectedSkills: (state, action) => {
      state.selectedSkills = action.payload
    },
    setCheckedSkills: (state, action) => {
      state.checkedSkills = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * List external evaluators
     */
    builder.addCase(getSkills.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getSkills.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.skills = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getSkills.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setSkills, setSelectedSkills, setCheckedSkills } = skillsSlice.actions
export default skillsSlice.reducer
