import React from "react"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"

interface SkillMapFormsDialogProps {
  open: boolean
  onClose?: (e: null | React.MouseEvent) => void
  onSubmit?: (e: null | React.MouseEvent) => void
  title?: React.ReactNode
  description?: React.ReactNode
}

const SkillMapFormsDialog: React.FC<SkillMapFormsDialogProps> = ({
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

export default SkillMapFormsDialog
