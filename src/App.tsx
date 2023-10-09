import { Provider } from "react-redux"
import "./App.css"
import { store } from "./redux/store"
import { setupAxiosInstance } from "./utils/axiosInstance"
import { PersistLogin } from "./PersistLogin"

function App() {
  setupAxiosInstance(store)
  return (
    <Provider store={store}>
      <PersistLogin />
    </Provider>
  )
}

export default App
