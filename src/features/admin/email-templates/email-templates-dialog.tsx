import React from "react"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"

interface EmailTemplatesDialogProps {
  open: boolean
  onClose?: () => void
  onSubmit?: () => void
  title?: React.ReactNode
  description?: React.ReactNode
}

const EmailTemplatesDialog: React.FC<EmailTemplatesDialogProps> = ({
  open,
  onSubmit,
  onClose,
  title,
  description,
}) => {
  return (
    <CustomDialog
      open={open}
      title={title}
      description={description}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  )
}

export default EmailTemplatesDialog
