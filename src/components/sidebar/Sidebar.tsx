import { useAppSelector } from "../../hooks/useAppSelector"

export const Sidebar = () => {
  const { activeSidebar } = useAppSelector((state) => state.app)

  return (
    <div
      className={`${
        activeSidebar ? "" : "-ml-64"
      } bg-primary-500 fixed w-full md:w-64 h-screen p-5 transition-all duration-300`}
    >
      Sidebar
    </div>
  )
}
