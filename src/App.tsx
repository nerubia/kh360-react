import { Provider } from "react-redux"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import "./App.css"
import { store } from "./redux/store"
import { setupAxiosInstance } from "./utils/axiosInstance"
import { Layout } from "./components/layouts/Layout"
import { Home } from "./pages/home"
import { Login } from "./pages/auth/login"
import { ForgotPassword } from "./pages/auth/forgot_password"
import { ResetPassword } from "./pages/auth/reset_password"

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/forgot",
        element: <ForgotPassword />,
      },
      {
        path: "/auth/reset",
        element: <ResetPassword />,
      },
    ],
  },
])

function App() {
  setupAxiosInstance()
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
