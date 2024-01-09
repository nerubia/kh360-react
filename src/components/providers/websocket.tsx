import React from "react"
import useWebSocket from "react-use-websocket"
import { type SendJsonMessage } from "react-use-websocket/dist/lib/types"
import { type ReadyState } from "react-use-websocket/dist/lib/constants"

interface WebSocketType {
  sendJsonMessage: SendJsonMessage
  lastJsonMessage: unknown
  readyState: ReadyState
}

const WebSocketContext = React.createContext<WebSocketType | null>(null)

interface WebSocketProps {
  children: React.ReactNode
}

const WebSocketProviderWrapper = ({ children }: WebSocketProps) => {
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    process.env.REACT_APP_WEBSOCKET_URL ?? "",
    {
      share: false,
      shouldReconnect: () => true,
    }
  )

  return (
    <WebSocketContext.Provider
      value={{
        sendJsonMessage,
        lastJsonMessage,
        readyState,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export { WebSocketContext, WebSocketProviderWrapper as WebSocketProvider, type WebSocketType }
