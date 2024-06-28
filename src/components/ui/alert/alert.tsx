import { type VariantProps, cva } from "class-variance-authority"
import { Button } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { removeAlert } from "@redux/slices/app-slice"
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
  index: number
}

export const Alert = ({ children, variant, index }: AlertProps) => {
  const appDispatch = useAppDispatch()

  useEffect(() => {
    setTimeout(() => appDispatch(removeAlert(index)), 5000)
  }, [index])

  const handleClose = () => {
    appDispatch(removeAlert(index))
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
