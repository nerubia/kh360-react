import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { type AxiosError } from "axios"
import { type ApiError } from "../../types/apiErrorType"
import { Loading } from "../../types/loadingType"
import { axiosInstance } from "../../utils/axios-instance"
import { type ScoreRating } from "../../types/score-rating-type"

export const getScoreRatings = createAsyncThunk(
  "scoreRatings/getScoreRatings",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstance.get("/user/score-ratings")
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
  score_ratings: ScoreRating[]
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  score_ratings: [],
}

const scoreRatingsSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers(builder) {
    /**
     * List
     */
    builder.addCase(getScoreRatings.pending, (state) => {
      state.loading = Loading.Pending
      state.error = null
    })
    builder.addCase(getScoreRatings.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled
      state.error = null
      state.score_ratings = action.payload
    })
    builder.addCase(getScoreRatings.rejected, (state, action) => {
      state.loading = Loading.Rejected
      state.error = action.payload as string
    })
  },
})

export default scoreRatingsSlice.reducer
