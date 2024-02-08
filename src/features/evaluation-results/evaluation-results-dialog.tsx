import React from "react"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"

interface EvaluationResultDetailsDialogProps {
  open: boolean
  variant?: "white" | undefined
  onSubmit?: () => void
  title?: React.ReactNode
  description?: React.ReactNode
}

const EvaluationResultDetailsDialog: React.FC<EvaluationResultDetailsDialogProps> = ({
  open,
  variant,
  onSubmit,
  title,
  description,
}) => {
  return (
    <CustomDialog
      open={open}
      variant={variant}
      size='medium'
      maxWidthMin={true}
      title={title}
      description={description}
      onSubmit={onSubmit}
      showCloseButton={false}
      submitButtonLabel='Close'
    />
  )
}

export default EvaluationResultDetailsDialog
