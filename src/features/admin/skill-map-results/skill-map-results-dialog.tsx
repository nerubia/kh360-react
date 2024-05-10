import React from "react"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"

interface SkillMapResultsDialogProps {
  open: boolean
  variant?: "white" | undefined
  onSubmit?: () => void
  title?: React.ReactNode
  description?: React.ReactNode
}

const SkillMapResultsDialog: React.FC<SkillMapResultsDialogProps> = ({
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

export default SkillMapResultsDialog
