import { useAppSelector } from "@hooks/useAppSelector"

export const useCmUser = () => {
  const { user } = useAppSelector((state) => state.auth)
  return (
    user?.roles?.includes("khv2_cm_admin") === true ||
    user?.roles?.includes("khv2_cm") === true ||
    false
  )
}
