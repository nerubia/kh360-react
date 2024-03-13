import React from "react"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"

interface SkillsDialogProps {
  open: boolean
  onClose?: () => void
  onSubmit?: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  loading?: boolean
}

const SkillsDialog: React.FC<SkillsDialogProps> = ({
  open,
  onSubmit,
  onClose,
  title,
  description,
  loading,
}) => {
  return (
    <CustomDialog
      open={open}
      title={title}
      description={description}
      onSubmit={onSubmit}
      onClose={onClose}
      loading={loading}
    />
  )
}

export default SkillsDialog
