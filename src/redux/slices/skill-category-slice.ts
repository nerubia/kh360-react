import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type SkillCategory } from "@custom-types/skill-category-type"
import { Loading } from "@custom-types/loadingType"
import { axiosInstance } from "@utils/axios-instance"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"

export const getSkillCategories = createAsyncThunk("skillCategories/list", async (_, thunkApi) => {
  try {
    const response = await axiosInstance.get("/admin/skill-categories")
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    const response = axiosError.response?.data as ApiError
    return thunkApi.rejectWithValue(response.message)
  }
})

interface InitialState {
  loading: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  skill_categories: SkillCategory[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  skill_categories: [],
}

const skillCategoriesSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /**
     * List active
     */
    builder.addCase(getSkillCategories.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getSkillCategories.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.skill_categories = action.payload
    })
    builder.addCase(getSkillCategories.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default skillCategoriesSlice.reducer
