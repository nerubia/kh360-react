import { Button } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"
import {
  EvaluationAdministrationStatus,
  type EvaluationAdministration,
} from "@custom-types/evaluation-administration-type"
import { type SurveyAdminstration } from "@custom-types/survey-administration-type"

interface SelectUsersFooterProps {
  administration: Array<EvaluationAdministration | SurveyAdminstration>
  selectedEmployeeIds: number[]
  onCancel: () => void
  onGoBack: () => void
  cancelDialogOpen: boolean
  backDialogOpen: boolean
  cancelDialogDescription: JSX.Element
  backDialogDescription: JSX.Element
  onCancelDialogClose: () => void
  onBackDialogClose: () => void
  onCancelSubmit: () => void
  onBackSubmit: () => void
  handleCheckAndReview: () => void
}

export const SelectUsersFooter = ({
  administration,
  selectedEmployeeIds,
  onCancel,
  onGoBack,
  cancelDialogOpen,
  backDialogOpen,
  cancelDialogDescription,
  backDialogDescription,
  onCancelDialogClose,
  onBackDialogClose,
  onCancelSubmit,
  onBackSubmit,
  handleCheckAndReview,
}: SelectUsersFooterProps) => {
  return (
    <>
      <div className='flex justify-between'>
        <Button variant='primaryOutline' onClick={onCancel}>
          Cancel & Exit
        </Button>
        <div className='flex items-center gap-2'>
          {administration[0]?.status !== EvaluationAdministrationStatus.Ongoing && (
            <Button testId='BackButton' variant='primaryOutline' size='medium' onClick={onGoBack}>
              <Icon icon='ChevronLeft' />
            </Button>
          )}
          <Button onClick={handleCheckAndReview} disabled={selectedEmployeeIds.length === 0}>
            Check & Review
          </Button>
        </div>
      </div>
      <CustomDialog
        open={cancelDialogOpen}
        title='Cancel & Exit'
        description={cancelDialogDescription}
        onClose={onCancelDialogClose}
        onSubmit={onCancelSubmit}
      />
      <CustomDialog
        open={backDialogOpen}
        title='Go Back'
        description={backDialogDescription}
        onClose={onBackDialogClose}
        onSubmit={onBackSubmit}
      />
    </>
  )
}
