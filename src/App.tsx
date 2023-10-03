import { RouterProvider, createBrowserRouter } from "react-router-dom"
import "./App.css"
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
  return <RouterProvider router={router} />
}

export default App
