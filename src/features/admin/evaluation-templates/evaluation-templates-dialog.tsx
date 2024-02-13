import React from "react"
import Dialog from "@components/ui/dialog/dialog"
import { Button } from "@components/ui/button/button"

interface EvaluationTemplateDialogProps {
  open: boolean
  onSubmit?: (e: null | React.MouseEvent) => void
  onClose?: (e: null | React.MouseEvent) => void
  title?: React.ReactNode
  description?: React.ReactNode
  size?: "small" | "medium" | null | undefined
  maxWidthMin?: boolean | null | undefined
  closeBtn?: string
  acceptBtn?: string
}

const EvaluationTemplateDialog: React.FC<EvaluationTemplateDialogProps> = ({
  open,
  onSubmit,
  title,
  description,
  onClose,
  size,
  maxWidthMin,
  closeBtn,
  acceptBtn,
}) => {
  return (
    <Dialog open={open} size={size} maxWidthMin={maxWidthMin}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{description}</Dialog.Description>
      <Dialog.Actions>
        <Button variant='primaryOutline' onClick={onClose}>
          {closeBtn}
        </Button>
        <Button variant='primary' onClick={onSubmit}>
          {acceptBtn}
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export default EvaluationTemplateDialog
