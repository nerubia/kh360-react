import { Provider } from "react-redux"
import "./App.css"
import { store } from "./redux/store"
import { setupAxiosInstance } from "./utils/axios-instance"
import { PersistLogin } from "./persist-login"

function App() {
  setupAxiosInstance(store)
  return (
    <Provider store={store}>
      <PersistLogin />
    </Provider>
  )
}

export default App
