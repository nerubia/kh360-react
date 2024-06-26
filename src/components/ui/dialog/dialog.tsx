import { useAppSelector } from "@hooks/useAppSelector"
import { type VariantProps, cva } from "class-variance-authority"
import { DialogActions } from "@components/ui/dialog/dialog-actions"
import { DialogDescription } from "@components/ui/dialog/dialog-description"
import { DialogTitle } from "@components/ui/dialog/dialog-title"
import { useMobileView } from "@hooks/use-mobile-view"

const dialog = cva(["w-full", "flex", "flex-col", "gap-4", "p-5", "rounded-md", "max-h-full"], {
  variants: {
    variant: {
      white: ["bg-white"],
    },
    size: {
      extraSmall: ["md:w-500 h-[350px]"],
      small: ["md:w-500"],
      medium: ["md:min-w-600 p-7"],
      lg: ["md:w-700"],
      xl: ["md:w-900"],
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

  const isMediumSize = useMobileView(1028)

  return open ? (
    <div className='fixed top-0 left-0 z-50 w-full h-full transition-all duration-300'>
      <div className={`${activeSidebar ? (isMediumSize ? "md:ml-44" : "md:ml-64") : ""} h-full`}>
        <div className='bg-black/50 overflow-y-auto w-full h-full flex justify-center items-center p-5'>
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
