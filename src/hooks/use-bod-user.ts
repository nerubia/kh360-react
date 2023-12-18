import { useAppSelector } from "./useAppSelector"

export const useBodUser = () => {
  const { user } = useAppSelector((state) => state.auth)
  return user?.user_details?.user_type === "bod"
}
