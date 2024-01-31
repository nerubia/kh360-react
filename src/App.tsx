import { Provider } from "react-redux"
import "@/App.css"
import { store } from "@redux/store"
import { setupAxiosInstance } from "@utils/axios-instance"
import { PersistLogin } from "@features/persist-login"
import { WebSocketProvider } from "@components/providers/websocket"

function App() {
  setupAxiosInstance(store)
  return (
    <Provider store={store}>
      <WebSocketProvider>
        <PersistLogin />
      </WebSocketProvider>
    </Provider>
  )
}

export default App
