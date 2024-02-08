import React from "react"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"

interface ProjectAssignmentsDialogProps {
  open: boolean
  onClose?: () => void
  onSubmit?: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  closeButtonLabel?: string
  submitButtonLabel?: string
}

const ProjectAssignmentsDialog: React.FC<ProjectAssignmentsDialogProps> = ({
  open,
  onSubmit,
  onClose,
  title,
  description,
  closeButtonLabel,
  submitButtonLabel,
}) => {
  return (
    <CustomDialog
      open={open}
      variant='white'
      title={title}
      description={description}
      onSubmit={onSubmit}
      onClose={onClose}
      closeButtonLabel={closeButtonLabel}
      submitButtonLabel={submitButtonLabel}
    />
  )
}

export default ProjectAssignmentsDialog
