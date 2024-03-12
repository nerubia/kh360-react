import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type SkillCategory } from "@custom-types/skill-category-type"
import { Loading } from "@custom-types/loadingType"
import { axiosInstance } from "@utils/axios-instance"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { type SkillCategoryFormData } from "@custom-types/form-data-type"

export const getSkillCategory = createAsyncThunk(
  "skillCategory/getSkillCategory",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/skill-categories/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const createSkillCategory = createAsyncThunk(
  "skillCategory/createSkillCategory",
  async (data: SkillCategoryFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post("/admin/skill-categories", data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const updateSkillCategory = createAsyncThunk(
  "skillCategory/updateSkillCategory",
  async (
    data: {
      id: number
      skillCategory: SkillCategoryFormData
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.put(
        `/admin/skill-categories/${data.id}`,
        data.skillCategory
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const deleteSkillCategory = createAsyncThunk(
  "skillCategory/deleteSkillCategory",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.delete(`/admin/skill-categories/${id}`)
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
  skill_category: SkillCategory | null
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
  totalItems: number
  selectedSkillCategoryId: number | null
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  skill_category: null,
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
  totalItems: 0,
  selectedSkillCategoryId: null,
}

const skillCategorySlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSelectedSkillCategoryId: (state, action) => {
      state.selectedSkillCategoryId = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * Get skill category
     */
    builder.addCase(getSkillCategory.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getSkillCategory.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.skill_category = action.payload
    })
    builder.addCase(getSkillCategory.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Create
     */
    builder.addCase(createSkillCategory.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(createSkillCategory.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.skill_category = action.payload
    })
    builder.addCase(createSkillCategory.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Update
     */
    builder.addCase(updateSkillCategory.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(updateSkillCategory.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.skill_category = action.payload
    })
    builder.addCase(updateSkillCategory.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Delete
     */
    builder.addCase(deleteSkillCategory.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(deleteSkillCategory.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(deleteSkillCategory.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setSelectedSkillCategoryId } = skillCategorySlice.actions
export default skillCategorySlice.reducer
