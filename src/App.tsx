import { Provider } from "react-redux"
import { GoogleOAuthProvider } from "@react-oauth/google"
import "./App.css"
import { store } from "./redux/store"
import { setupAxiosInstance } from "./utils/axiosInstance"
import { PersistLogin } from "./PersistLogin"

function App() {
  setupAxiosInstance(store)
  return (
    <Provider store={store}>
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID as string}
      >
        <PersistLogin />
      </GoogleOAuthProvider>
    </Provider>
  )
}

export default App
