import { useAppSelector } from "./useAppSelector"

export const useCmUser = () => {
  const { user } = useAppSelector((state) => state.auth)
  return user?.roles?.includes("khv2_cm_admin") ?? user?.roles?.includes("khv2_cm") ?? false
}
