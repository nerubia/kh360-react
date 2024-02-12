import React from "react"
import Dialog from "@components/ui/dialog/dialog"
import { Button, LinkButton } from "@components/ui/button/button"

interface CustomDialogProps {
  open: boolean
  title: React.ReactNode
  description: React.ReactNode
  showCloseButton?: boolean
  showSubmitButton?: boolean
  showLinkButton?: boolean
  closeButtonLabel?: string
  submitButtonLabel?: string
  linkButtonLabel?: string
  variant?: "white" | undefined
  size?: "small" | "medium" | undefined
  maxWidthMin?: true | undefined
  onClose?: () => void
  onSubmit?: () => void
  loading?: boolean
  linkTo?: string
  dialogNoButton?: string
  dialogYesButton?: string
}

export const CustomDialog = ({
  open,
  title,
  description,
  showCloseButton = true,
  showSubmitButton = true,
  showLinkButton = false,
  closeButtonLabel,
  submitButtonLabel,
  linkButtonLabel,
  variant,
  size,
  maxWidthMin,
  onClose,
  onSubmit,
  loading,
  linkTo,
  dialogNoButton,
  dialogYesButton,
}: CustomDialogProps) => {
  return (
    <Dialog open={open} variant={variant} size={size} maxWidthMin={maxWidthMin}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{description}</Dialog.Description>
      <Dialog.Actions>
        {showCloseButton && (
          <Button variant='primaryOutline' onClick={onClose} testId={dialogNoButton}>
            {closeButtonLabel ?? "No"}
          </Button>
        )}
        {showSubmitButton && (
          <Button variant='primary' onClick={onSubmit} loading={loading} testId={dialogYesButton}>
            {submitButtonLabel ?? "Yes"}
          </Button>
        )}
        {showLinkButton && (
          <LinkButton to={linkTo ?? ""} testId={dialogYesButton}>
            {linkButtonLabel ?? "Yes"}
          </LinkButton>
        )}
      </Dialog.Actions>
    </Dialog>
  )
}
