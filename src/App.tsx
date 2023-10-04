import { Provider } from "react-redux"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import "./App.css"
import { store } from "./redux/store"
import { setupAxiosInstance } from "./utils/axiosInstance"
import { Layout } from "./components/layouts/Layout"

import { AuthRoute } from "./routes/AuthRoute"
import { Home } from "./pages/home"
import { Login } from "./pages/auth/login"
import { ForgotPassword } from "./pages/auth/forgot_password"
import { ResetPassword } from "./pages/auth/reset_password"

import { PrivateRoute } from "./routes/PrivateRoute"
import { Dashboard } from "./pages/dashboard/dashboard"

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    element: <AuthRoute />,
    children: [
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
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
])

function App() {
  setupAxiosInstance(store)
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
