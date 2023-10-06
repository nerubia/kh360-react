import { type CodeResponse, useGoogleLogin } from "@react-oauth/google"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { loginWithGoogle } from "../../../redux/slices/authSlice"
import { Button } from "../../../components/button/Button"

export const LoginOptions = () => {
  const appDispatch = useAppDispatch()

  const login = useGoogleLogin({
    onSuccess: async (codeResponse: CodeResponse) => {
      await appDispatch(loginWithGoogle(codeResponse))
    },
    flow: "auth-code",
  })

  return (
    <div className='flex flex-col'>
      <Button name='Sign in with Google' onClick={() => login()} />
    </div>
  )
}
