import { type VariantProps, cva } from "class-variance-authority"
import { Button } from "../button/Button"
import { Icon } from "../icon/Icon"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { setAlert } from "../../redux/slices/appSlice"
import { useEffect } from "react"

const alert = cva(["relative", "p-5", "rounded-md"], {
  variants: {
    variant: {
      primary: ["bg-primary-500", "text-white"],
      success: ["bg-green-500", "text-white"],
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
