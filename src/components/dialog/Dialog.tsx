import { useAppSelector } from "../../hooks/useAppSelector"
import { DialogActions } from "./DialogActions"
import { DialogDescription } from "./DialogDescription"
import { DialogTitle } from "./DialogTitle"

interface DialogProps {
  open: boolean
  children: React.ReactNode
  width?: string
}

function Dialog({ open, children, width = "md:w-[500px]" }: DialogProps) {
  const { activeSidebar } = useAppSelector((state) => state.app)
  return open ? (
    <div className='fixed top-0 left-0 z-50 w-full h-full transition-all duration-300'>
      <div className={`${activeSidebar ? "md:ml-64" : ""} h-full`}>
        <div className='bg-black/50 w-full h-full flex justify-center items-center p-5'>
          <div className={`bg-white w-full ${width} flex flex-col gap-4 p-5 rounded-md`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  ) : null
}

Dialog.Title = DialogTitle
Dialog.Description = DialogDescription
Dialog.Actions = DialogActions

export default Dialog
