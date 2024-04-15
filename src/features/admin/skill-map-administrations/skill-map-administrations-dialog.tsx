import { CustomDialog } from "@components/ui/dialog/custom-dialog"

interface SkillMapAdminDialogProps {
  open: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  onClose?: () => void
  onSubmit?: () => void
  loading?: boolean | undefined
  showCloseButton?: boolean
  submitButtonLabel?: string
}

const SkillMapAdminDialog: React.FC<SkillMapAdminDialogProps> = ({
  open,
  title,
  description,
  onClose,
  onSubmit,
  loading,
  showCloseButton,
  submitButtonLabel,
}: SkillMapAdminDialogProps) => {
  return (
    <CustomDialog
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      onSubmit={onSubmit}
      loading={loading}
      showCloseButton={showCloseButton}
      submitButtonLabel={submitButtonLabel}
    />
  )
}
export default SkillMapAdminDialog
