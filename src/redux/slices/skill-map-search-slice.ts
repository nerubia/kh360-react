import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { axiosInstance } from "@utils/axios-instance"
import { Loading } from "@custom-types/loadingType"
import {
  type SkillMapSearchFilters,
  type SkillMapSearch,
} from "@custom-types/skill-map-search-type"

export const getSkillMapSearch = createAsyncThunk(
  "skillMapSearch/getSkillMapSearch",
  async (params: SkillMapSearchFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/skill-map-search/`, {
        params,
      })
      return response.data.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

interface InitialState {
  loading: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  loading_send: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  skill_map_search: SkillMapSearch[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
  totalItems: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  loading_send: Loading.Idle,
  error: null,
  skill_map_search: [],
  hasPreviousPage: false,
  hasNextPage: false,
  totalPages: 0,
  totalItems: 0,
}

const skillMapSearch = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSkillMapSearch: (state, action) => {
      state.skill_map_search = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * List skill map search
     */
    builder.addCase(getSkillMapSearch.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getSkillMapSearch.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.skill_map_search = action.payload
    })
    builder.addCase(getSkillMapSearch.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setSkillMapSearch } = skillMapSearch.actions
export default skillMapSearch.reducer
