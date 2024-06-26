import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "@custom-types/apiErrorType"
import { type UserSkillMap, type User, type UserFilters } from "@custom-types/user-type"
import { axiosInstance } from "@utils/axios-instance"
import { Loading } from "@custom-types/loadingType"

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (params: UserFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/users", {
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

export const getUsersOnScroll = createAsyncThunk(
  "users/getUsersScroll",
  async (params: UserFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/users", {
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

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (params: UserFilters | undefined, thunkApi) => {
    try {
      const response = await axiosInstance.get("/admin/users/all", {
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

export const getUserSkillMap = createAsyncThunk(
  "users/getUserSkillMap",
  async (id: number, thunkApi) => {
    try {
      const response = await axiosInstance.get(`/admin/users/${id}/skill-map`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const response = axiosError.response?.data as ApiError
      return thunkApi.rejectWithValue(response.message)
    }
  }
)

export const getUserSkillMapBySkillId = createAsyncThunk(
  "users/getUserSkillMapBySkillId",
  async (params: { id: number; skillId: number }, thunkApi) => {
    try {
      const response = await axiosInstance.get(
        `/admin/users/${params.id}/skill-map/${params.skillId}`
      )
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
  users: User[]
  allUsers: User[]
  user_skill_map: UserSkillMap[]
  selectedSkillMapAdminId: string
  hasPreviousPage: boolean
  hasNextPage: boolean
  currentPage: number
  totalPages: number
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  users: [],
  allUsers: [],
  user_skill_map: [],
  selectedSkillMapAdminId: "all",
  hasPreviousPage: false,
  hasNextPage: false,
  currentPage: 1,
  totalPages: 0,
}

const usersSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload
    },
    setUserSkillMap: (state, action) => {
      state.user_skill_map = action.payload
    },
    setSelectedSkillMapAdminId: (state, action) => {
      state.selectedSkillMapAdminId = action.payload
    },
  },
  extraReducers(builder) {
    /**
     * List
     */
    builder.addCase(getUsers.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.users = action.payload.data
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
    })
    builder.addCase(getUsers.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * List on scroll
     */
    builder.addCase(getUsersOnScroll.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getUsersOnScroll.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      if (action.payload.pageInfo.currentPage > 1) {
        const newData: User[] = []
        const payloadData = action.payload.data as User[]
        for (const data of payloadData) {
          if (!state.users.some((user) => user.id === data.id)) {
            newData.push(data)
          }
        }
        state.users = payloadData.length > 0 ? [...state.users, ...newData] : []
      } else {
        state.users = action.payload.data
      }
      state.hasPreviousPage = action.payload.pageInfo.hasPreviousPage
      state.hasNextPage = action.payload.pageInfo.hasNextPage
      state.totalPages = action.payload.pageInfo.totalPages
    })
    builder.addCase(getUsersOnScroll.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * ALl
     */
    builder.addCase(getAllUsers.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.allUsers = action.payload.data
    })
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * User skill map
     */
    builder.addCase(getUserSkillMap.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getUserSkillMap.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.user_skill_map = action.payload
    })
    builder.addCase(getUserSkillMap.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
    /**
     * User skill map by skill id
     */
    builder.addCase(getUserSkillMapBySkillId.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getUserSkillMapBySkillId.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.user_skill_map = action.payload
    })
    builder.addCase(getUserSkillMapBySkillId.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export const { setUsers, setUserSkillMap, setSelectedSkillMapAdminId } = usersSlice.actions
export default usersSlice.reducer
