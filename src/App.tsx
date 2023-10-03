import { RouterProvider, createBrowserRouter } from "react-router-dom"
import "./App.css"
import { Layout } from "./components/layouts/Layout"
import { Home } from "./pages/home"
import { Login } from "./pages/auth/login"

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
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
