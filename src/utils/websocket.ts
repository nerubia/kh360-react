import { type Store } from "@reduxjs/toolkit"
import { type RootState } from "../redux/store"
import { WebSocketState } from "../types/websocket-type"
import { setMessage, setStatus } from "../redux/slices/websocket-slice"

export let socket: WebSocket | null

export const setupWebsocket = (store: Store<RootState>) => {
  socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL ?? "")

  socket.onopen = () => {
    store.dispatch(setStatus(WebSocketState.Connected))
  }

  socket.onmessage = (event) => {
    store.dispatch(setMessage(JSON.parse(event.data as string)))
  }

  socket.onclose = () => {
    socket?.close()
    socket = null
    store.dispatch(setStatus(WebSocketState.Disconnected))

    // Reconnect after a delay
    setTimeout(() => {
      setupWebsocket(store)
    }, 2000)
  }
}
