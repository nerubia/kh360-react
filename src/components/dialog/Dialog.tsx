import { useAppSelector } from "../../hooks/useAppSelector"
import { type VariantProps, cva } from "class-variance-authority"
import { DialogActions } from "./DialogActions"
import { DialogDescription } from "./DialogDescription"
import { DialogTitle } from "./DialogTitle"

const dialog = cva(["w-full", "flex", "flex-col", "gap-4", "p-5", "rounded-md"], {
  variants: {
    variant: {
      white: ["bg-white"],
    },
    size: {
      small: ["md:w-[500px]"],
      medium: ["md:min-w-[600px] p-7"],
    },
    maxWidthMin: {
      true: "max-w-min",
    },
  },
  defaultVariants: {
    variant: "white",
    size: "small",
  },
})

interface DialogProps extends VariantProps<typeof dialog> {
  open: boolean
  children: React.ReactNode
  width?: string
}

function Dialog({ open, children, variant, size, maxWidthMin }: DialogProps) {
  const { activeSidebar } = useAppSelector((state) => state.app)
  return open ? (
    <div className='fixed top-0 left-0 z-50 w-full h-full transition-all duration-300'>
      <div className={`${activeSidebar ? "md:ml-64" : ""} h-full`}>
        <div className='bg-black/50 w-full h-full flex justify-center items-center p-5'>
          <div className={dialog({ variant, size, maxWidthMin })}>{children}</div>
        </div>
      </div>
    </div>
  ) : null
}

Dialog.Title = DialogTitle
Dialog.Description = DialogDescription
Dialog.Actions = DialogActions

export default Dialog
