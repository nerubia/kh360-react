import {
  type CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { loginWithGoogle } from "../../../redux/slices/authSlice"

export const LoginOptions = () => {
  const appDispatch = useAppDispatch()

  const login = async (credentialResponse: CredentialResponse) => {
    try {
      await appDispatch(loginWithGoogle(credentialResponse))
    } catch (error) {}
  }

  return (
    <div>
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID as string}
      >
        <GoogleLogin onSuccess={login} />
      </GoogleOAuthProvider>
    </div>
  )
}
