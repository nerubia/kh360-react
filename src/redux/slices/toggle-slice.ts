import { createSlice } from "@reduxjs/toolkit"

interface InitialState {
  isToggled: boolean
}
const initialState: InitialState = {
  isToggled: false,
}
const toggleStateSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleIsToggled: (state) => {
      state.isToggled = !state.isToggled
    },
    setIsToggled: (state, action) => {
      state.isToggled = action.payload
    },
  },
})
export const { toggleIsToggled, setIsToggled } = toggleStateSlice.actions
export default toggleStateSlice.reducer
