import React from "react"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"

interface SkillCategoriesDialogProps {
  open: boolean
  onClose?: () => void
  onSubmit?: () => void
  title?: React.ReactNode
  description?: React.ReactNode
}

const SkillCategoriesDialog: React.FC<SkillCategoriesDialogProps> = ({
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

export default SkillCategoriesDialog
