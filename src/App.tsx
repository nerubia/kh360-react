import { Provider } from "react-redux"
import "./App.css"
import { store } from "./redux/store"
import { setupAxiosInstance } from "./utils/axios-instance"
import { setupWebsocket } from "./utils/websocket"
import { PersistLogin } from "./features/persist-login"

function App() {
  setupAxiosInstance(store)
  setupWebsocket(store)
  return (
    <Provider store={store}>
      <PersistLogin />
    </Provider>
  )
}

export default App
