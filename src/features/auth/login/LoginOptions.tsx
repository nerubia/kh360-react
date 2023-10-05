import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"

export const LoginOptions = () => {
  const loginWithGoogle = () => {}

  return (
    <div>
      <GoogleOAuthProvider clientId='client id here'>
        <GoogleLogin onSuccess={loginWithGoogle} />
      </GoogleOAuthProvider>
    </div>
  )
}
