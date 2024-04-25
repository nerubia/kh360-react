import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {
  SkillMapAdminStatus,
  type SkillMapAdministration,
} from "@custom-types/skill-map-admin-type"
import { Loading } from "@custom-types/loadingType"
import { axiosInstance } from "@utils/axios-instance"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { type SkillMapAdminFormData } from "@custom-types/form-data-type"

export const getSkillMapAdmin = createAsyncThunk(
  "skillMapAdministration/getSkillMapAdmin",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/skill-map-administrations/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const getSkillMapAdminSocket = createAsyncThunk(
  "skillMapAdministration/getSkillMapAdminSocket",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/skill-map-administrations/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const createSkillMapAdmin = createAsyncThunk(
  "skillMapAdministration/createSkillMapAdmin",
  async (data: SkillMapAdminFormData, thunkApi) => {
    try {
      const response = await axiosInstance.post("/admin/skill-map-administrations", data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const updateSkillMapAdmin = createAsyncThunk(
  "skillMapAdministration/updateSkillMapAdmin",
  async (
    data: {
      id: number
      skillMapAdmin: SkillMapAdminFormData
    },
    thunkApi
  ) => {
    try {
      const response = await axiosInstance.put(
        `/admin/skill-map-administrations/${data.id}`,
        data.skillMapAdmin
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const deleteSkillMapAdmin = createAsyncThunk(
  "skillMapAdministration/deleteSkillMapAdmin",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.delete(`/admin/skill-map-administrations/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const closeSkillMapAdministration = createAsyncThunk(
  "skillMapAdministration/close",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.post(`/admin/skill-map-administrations/${id}/close`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const cancelSkillMapAdministration = createAsyncThunk(
  "skillMapAdministration/cancel",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.post(`/admin/skill-map-administrations/${id}/cancel`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const reopenSkillMapAdministration = createAsyncThunk(
  "skillMapAdministration/reopen",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.post(`/admin/skill-map-administrations/${id}/reopen`)
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
  loading_send: Loading.Idle | Loading.Pending | Loading.Fulfilled | Loading.Rejected
  error: string | null
  skill_map_administration: SkillMapAdministration | null
  selectedEmployeeIds: number[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  loading_send: Loading.Idle,
  error: null,
  skill_map_administration: null,
  selectedEmployeeIds: [],
}

const skillMapAdministrationSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSelectedEmployeeIds: (state, action) => {
      state.selectedEmployeeIds = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * Get skill map administration
     */
    builder.addCase(getSkillMapAdmin.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getSkillMapAdmin.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.skill_map_administration = action.payload
    })
    builder.addCase(getSkillMapAdmin.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Get triggered by socket
     */
    builder.addCase(getSkillMapAdminSocket.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.skill_map_administration = action.payload
    })
    /**
     * Create
     */
    builder.addCase(createSkillMapAdmin.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(createSkillMapAdmin.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.skill_map_administration = action.payload
    })
    builder.addCase(createSkillMapAdmin.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Update
     */
    builder.addCase(updateSkillMapAdmin.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(updateSkillMapAdmin.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.skill_map_administration = action.payload
    })
    builder.addCase(updateSkillMapAdmin.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Delete
     */
    builder.addCase(deleteSkillMapAdmin.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(deleteSkillMapAdmin.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
    })
    builder.addCase(deleteSkillMapAdmin.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Close
     */
    builder.addCase(closeSkillMapAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(closeSkillMapAdministration.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
      if (state.skill_map_administration !== null) {
        state.skill_map_administration = {
          ...state.skill_map_administration,
          status: SkillMapAdminStatus.Closed,
        }
      }
    })
    builder.addCase(closeSkillMapAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Cancel
     */
    builder.addCase(cancelSkillMapAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(cancelSkillMapAdministration.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
      if (state.skill_map_administration !== null) {
        state.skill_map_administration = {
          ...state.skill_map_administration,
          status: SkillMapAdminStatus.Cancelled,
        }
      }
    })
    builder.addCase(cancelSkillMapAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * Reopen
     */
    builder.addCase(reopenSkillMapAdministration.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(reopenSkillMapAdministration.fulfilled, (state) => {
      state.loading = Loading.Fulfilled
      state.error = null
      if (state.skill_map_administration !== null) {
        state.skill_map_administration = {
          ...state.skill_map_administration,
          status: SkillMapAdminStatus.Ongoing,
        }
      }
    })
    builder.addCase(reopenSkillMapAdministration.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setSelectedEmployeeIds } = skillMapAdministrationSlice.actions
export default skillMapAdministrationSlice.reducer
