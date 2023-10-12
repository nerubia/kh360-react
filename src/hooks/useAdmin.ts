import { useAppSelector } from "./useAppSelector"

export const useAdmin = () => {
  const { user } = useAppSelector((state) => state.auth)
  return user?.roles.includes("kh360") ?? false
}
