import { CustomDialog } from "@components/ui/dialog/custom-dialog"

interface ProgressDialogProps {
  open: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  onClose?: () => void
  onSubmit?: () => void
}

const ProgressDialog: React.FC<ProgressDialogProps> = ({
  open,
  title,
  description,
  onClose,
  onSubmit,
}: ProgressDialogProps) => {
  return (
    <CustomDialog
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  )
}
export default ProgressDialog
