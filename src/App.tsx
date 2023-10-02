import { RouterProvider, createBrowserRouter } from "react-router-dom"
import "./App.css"
import { Layout } from "./components/layouts/Layout"
import { Home } from "./pages/home"

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
])

function App() {
  return <RouterProvider router={router} />
}

export default App
