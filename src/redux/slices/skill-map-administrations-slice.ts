import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { axiosInstance } from "@utils/axios-instance"
import { Loading } from "@custom-types/loadingType"
import {
  type SkillMapAdministration,
  type SkillMapAdminFilters,
} from "@custom-types/skill-map-admin-type"

export const getSkillMapAdministrations = createAsyncThunk(
  "skillMapAdministrations/getSkillMapAdministrations",
  async (params: SkillMapAdminFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/skill-map-administrations", {
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

export const getSkillMapAdministrationsSocket = createAsyncThunk(
  "skillMapAdministrations/getSkillMapAdministrationsSocket",
  async (params: SkillMapAdminFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/skill-map-administrations", {
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
  user_skill_map_administrations: SkillMapAdministration[]
  skill_map_administrations: SkillMapAdministration[]
  hasPreviousPage: boolean
  hasNextPage: boolean
  currentPage: number
  totalPages: number
  totalItems: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  user_skill_map_administrations: [],
  skill_map_administrations: [],
  hasPreviousPage: false,
  hasNextPage: false,
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,
}

const skillMapAdministrationsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /**
     * List
     */
    builder.addCase(getSkillMapAdministrations.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getSkillMapAdministrations.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.skill_map_administrations = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
    builder.addCase(getSkillMapAdministrations.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List triggered by socket
     */
    builder.addCase(getSkillMapAdministrationsSocket.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.skill_map_administrations = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
      state.totalItems = action.payload.pageInfo.totalItems
    })
  },
})

export default skillMapAdministrationsSlice.reducer
