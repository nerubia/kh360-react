import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { WebSocketState } from "../../types/websocket-type"
import { socket } from "../../utils/websocket"

interface InitialState {
  message: string
  status: WebSocketState
}

const initialState: InitialState = {
  message: "",
  status: WebSocketState.Connecting,
}

export const sendMessage = createAsyncThunk(
  "websocket/sendMessage",
  async (message: string, thunkApi) => {
    try {
      if (socket !== null && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "message", content: message }))
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

const websocketSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload
    },
    setStatus: (state, action) => {
      state.status = action.payload
    },
  },
})

export const { setMessage, setStatus } = websocketSlice.actions
export default websocketSlice.reducer
