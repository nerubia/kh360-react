import { useAppSelector } from "./useAppSelector"

export const useInternalUser = () => {
  const { user } = useAppSelector((state) => state.auth)
  return user?.is_external !== true
}
