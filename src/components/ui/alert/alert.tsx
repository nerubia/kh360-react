import { type VariantProps, cva } from "class-variance-authority"
import { Button } from "../button/button"
import { Icon } from "../icon/icon"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { setAlert } from "../../../redux/slices/app-slice"
import { useEffect } from "react"

const alert = cva(["relative", "p-5", "rounded-md"], {
  variants: {
    variant: {
      primary: ["bg-customPurple-100", "text-customPurple-700", "border-customPurple-400"],
      success: ["bg-customLightGreen-100", "text-customGreen-700", "border-customGreen-300"],
      destructive: ["bg-customRed-100", "text-customRed-700", "border-customRed-300"],
    },
  },
  defaultVariants: {
    variant: "primary",
  },
})

interface AlertProps extends VariantProps<typeof alert> {
  children: React.ReactNode
}

export const Alert = ({ children, variant }: AlertProps) => {
  const appDispatch = useAppDispatch()

  useEffect(() => {
    setTimeout(() => appDispatch(setAlert({})), 5000)
  }, [])

  const handleClose = () => {
    appDispatch(setAlert({}))
  }

  return (
    <div className={alert({ variant })}>
      <div className='absolute top-1 right-1'>
        <Button variant='unstyled' size='small' onClick={handleClose}>
          <Icon icon='Close' />
        </Button>
      </div>
      {children}
    </div>
  )
}
