import React from "react"
import Dialog from "@components/ui/dialog/dialog"
import { Button } from "@components/ui/button/button"

interface CustomDialogProps {
  open: boolean
  title: React.ReactNode
  description: React.ReactNode
  showCloseButton?: boolean
  showSubmitButton?: boolean
  closeButtonLabel?: string
  submitButtonLabel?: string
  variant?: "white" | undefined
  size?: "small" | "medium" | undefined
  maxWidthMin?: true | undefined
  onClose?: () => void
  onSubmit?: () => void
  loading?: boolean
}

export const CustomDialog = ({
  open,
  title,
  description,
  showCloseButton = true,
  showSubmitButton = true,
  closeButtonLabel,
  submitButtonLabel,
  variant,
  size,
  maxWidthMin,
  onClose,
  onSubmit,
  loading,
}: CustomDialogProps) => {
  return (
    <Dialog open={open} variant={variant} size={size} maxWidthMin={maxWidthMin}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{description}</Dialog.Description>
      <Dialog.Actions>
        {showCloseButton && (
          <Button variant='primaryOutline' onClick={onClose} testId='DialogNoButton'>
            {closeButtonLabel ?? "No"}
          </Button>
        )}
        {showSubmitButton && (
          <Button variant='primary' onClick={onSubmit} loading={loading} testId='DialogYesButton'>
            {submitButtonLabel ?? "Yes"}
          </Button>
        )}
      </Dialog.Actions>
    </Dialog>
  )
}
