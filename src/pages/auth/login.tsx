import { GoogleOAuthProvider } from "@react-oauth/google"
import { LoginForm } from "../../features/auth/login/LoginForm"
import { LoginOptions } from "../../features/auth/login/LoginOptions"
import { useTitle } from "../../hooks/useTitle"

export default function Login() {
  useTitle("Login")

  return (
    <div className='flex justify-center pt-10 p-4'>
      <div className='w-full sm:w-96 flex flex-col p-4 shadow-md'>
        <h1 className='text-lg font-bold'>KaishaHero</h1>
        <LoginForm />
        <div className='relative py-10'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-white px-2'>Or continue with</span>
          </div>
        </div>
        <GoogleOAuthProvider
          clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID as string}
        >
          <LoginOptions />
        </GoogleOAuthProvider>
      </div>
    </div>
  )
}
