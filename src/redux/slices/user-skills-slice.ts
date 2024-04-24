import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { axiosInstance } from "@utils/axios-instance"
import { Loading } from "@custom-types/loadingType"
import { type Skill, type SkillFilters } from "@custom-types/skill-type"

export const getUserSkills = createAsyncThunk(
  "userSkills/getUserSkills",
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
  user_skills: Skill[]
  selectedUserSkills: Skill[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
  totalItems: number
  checkedUserSkills: Skill[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  user_skills: [],
  selectedUserSkills: [],
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
  totalItems: 0,
  checkedUserSkills: [],
}

const userSkillsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUserSkills: (state, action) => {
      state.user_skills = action.payload
    },
    setSelectedUserSkills: (state, action) => {
      state.selectedUserSkills = action.payload
    },
    setCheckedUserSkills: (state, action) => {
      state.checkedUserSkills = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * Get user skills
     */
    builder.addCase(getUserSkills.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getUserSkills.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.user_skills = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getUserSkills.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setUserSkills, setSelectedUserSkills, setCheckedUserSkills } =
  userSkillsSlice.actions
export default userSkillsSlice.reducer
