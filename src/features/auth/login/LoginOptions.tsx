import { type CodeResponse, useGoogleLogin } from "@react-oauth/google"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { loginWithGoogle } from "../../../redux/slices/authSlice"
import { Button } from "../../../components/button/Button"
import { Icon } from "../../../components/icon/Icon"

export const LoginOptions = () => {
  const appDispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.auth)

  const login = useGoogleLogin({
    onSuccess: async (codeResponse: CodeResponse) => {
      await appDispatch(loginWithGoogle(codeResponse))
    },
    flow: "auth-code",
  })

  return (
    <div className='flex flex-col'>
      <Button
        variant='primaryOutline'
        fullWidth
        onClick={() => login()}
        loading={loading}
      >
        <Icon icon='Google' />
        Google
      </Button>
    </div>
  )
}
