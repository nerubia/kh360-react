import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../../../components/ui/button/button"
import { StarRating } from "../../../components/ui/rating/star-rating"
import {
  getEvaluationTemplateContents,
  updateEvaluationRatingById,
  setIsEditing,
  setShowRatingCommentInput,
} from "../../../redux/slices/evaluation-template-contents-slice"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import {
  submitEvaluation,
  updateEvaluationStatusById,
  sendRequestToRemove,
} from "../../../redux/slices/user-slice"
import { Loading } from "../../../types/loadingType"
import { setAlert } from "../../../redux/slices/appSlice"
import { EvaluationStatus, type Evaluation } from "../../../types/evaluation-type"
import { formatDateRange } from "../../../utils/format-date"
import { TextArea } from "../../../components/ui/textarea/text-area"
import Dialog from "../../../components/ui/dialog/dialog"
import { AnswerType } from "../../../types/answer-option-type"
import { getRatingTemplates } from "../../../redux/slices/email-template-slice"
import { type EmailTemplate, TemplateType } from "../../../types/email-template-type"
import ReactConfetti from "react-confetti"

export const EvaluationsCriteria = () => {
  const { id, evaluation_id } = useParams()
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { evaluation_template_contents, is_editing } = useAppSelector(
    (state) => state.evaluationTemplateContents
  )
  const { loading, loading_comment, loading_answer, user_evaluations } = useAppSelector(
    (state) => state.user
  )
  const { emailTemplate } = useAppSelector((state) => state.emailTemplate)
  const { ratingTemplates } = useAppSelector((state) => state.emailTemplate)

  const [evaluation, setEvaluation] = useState<Evaluation>()
  const [comment, setComment] = useState<string>("")
  const [recommendation, setRecommendation] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [ratingCommentErrorMessage, setRatingCommentErrorMessage] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState<Record<number, boolean>>({})
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState<boolean>(false)
  const [showRequestToRemoveDialog, setShowRequestToRemoveDialog] = useState<boolean>(false)
  const [dialogMessage, setDialogMessage] = useState<EmailTemplate>()
  const [currentNATemplateIndex, setCurrentNATemplateIndex] = useState<number>(0)
  const [currentHighRatingTemplateIndex, setCurrentHighRatingTemplateIndex] = useState<number>(0)
  const [currentLowRatingTemplateIndex, setCurrentLowRatingTemplateIndex] = useState<number>(0)
  const [isRatingHigh, setIsRatingHigh] = useState<boolean>(false)
  const [isRatingLow, setIsRatingLow] = useState<boolean>(false)
  const [showCompletedDialog, setShowCompletedDialog] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)

  useEffect(() => {
    void appDispatch(setIsEditing(false))
  }, [evaluation_id])

  useEffect(() => {
    void appDispatch(getRatingTemplates())
  }, [])

  useEffect(() => {
    const evaluationRatings = evaluation_template_contents.map(
      (templateContent) => templateContent.evaluationRating
    )
    const highestCount = evaluationRatings.filter(
      (rating) => rating.ratingAnswerType === AnswerType.Highest
    ).length
    const lowestCount = evaluationRatings.filter(
      (rating) => rating.ratingAnswerType === AnswerType.Lowest
    ).length
    const allRatingsWithoutNA = evaluationRatings.filter(
      (rating) => rating.ratingAnswerType !== AnswerType.NA
    )
    const highestCountPercentage = (highestCount / allRatingsWithoutNA.length) * 100
    const lowestCountPercentage = (lowestCount / allRatingsWithoutNA.length) * 100

    setIsRatingHigh(highestCountPercentage >= 75)
    setIsRatingLow(lowestCountPercentage >= 75)
  }, [evaluation_template_contents])

  useEffect(() => {
    if (evaluation_id !== "all") {
      const getTemplateContents = async () => {
        try {
          const result = await appDispatch(
            getEvaluationTemplateContents({
              evaluation_id,
            })
          )
          if (result.type === "evaluationTemplate/getEvaluationTemplateContents/rejected") {
            navigate(`evaluation-administrations/`)
          }
        } catch (error) {}
      }
      void getTemplateContents()
      setEvaluation(
        user_evaluations?.find((evaluation) => evaluation.id === parseInt(evaluation_id as string))
      )
    }
  }, [evaluation_id, user_evaluations])

  useEffect(() => {
    setErrorMessage(null)
    setRatingCommentErrorMessage(null)
    if (evaluation?.comments !== undefined && evaluation?.comments !== null) {
      setComment(evaluation.comments)
    } else {
      setComment("")
    }
    if (evaluation?.recommendations !== undefined && evaluation?.recommendations !== null) {
      setRecommendation(evaluation.recommendations)
    } else {
      setRecommendation("")
    }
  }, [evaluation])

  const getFilteredTemplates = (templateType: string) => {
    return ratingTemplates.filter((template) => template.template_type === templateType)
  }

  const getNextIndex = (currentIndex: number, templatesLength: number) => {
    return (currentIndex + 1) % templatesLength
  }

  const handleSetRatingTemplate = (isNa: boolean) => {
    let nextIndex, nextTemplate

    if (ratingTemplates.length > 0) {
      if (isRatingHigh) {
        const highRatingTemplates = getFilteredTemplates(TemplateType.HighRating)
        nextIndex = getNextIndex(currentHighRatingTemplateIndex, highRatingTemplates.length)
        nextTemplate = highRatingTemplates[nextIndex]
        setCurrentHighRatingTemplateIndex(nextIndex)
      }
      if (isRatingLow) {
        const lowRatingTemplates = getFilteredTemplates(TemplateType.LowRating)
        nextIndex = getNextIndex(currentLowRatingTemplateIndex, lowRatingTemplates.length)
        nextTemplate = lowRatingTemplates[nextIndex]
        setCurrentLowRatingTemplateIndex(nextIndex)
      }
      if (isNa) {
        const naRatingTemplates = getFilteredTemplates(TemplateType.NARating)
        nextIndex = getNextIndex(currentNATemplateIndex, naRatingTemplates.length)
        nextTemplate = naRatingTemplates[nextIndex]
        setCurrentNATemplateIndex(nextIndex)
      }

      setDialogMessage(nextTemplate)
    }
  }

  const toggleDialog = (templateContentId: number) => {
    setShowDialog((prev) => {
      const updatedShowDialog = { ...prev }
      updatedShowDialog[templateContentId] = !updatedShowDialog[templateContentId]
      return updatedShowDialog
    })
  }

  const toggleSaveDialog = () => {
    setShowSaveDialog((prev) => !prev)
  }

  const toggleSubmitDialog = () => {
    setShowSubmitDialog((prev) => !prev)
  }

  const toggleCompletedDialog = () => {
    setShowCompletedDialog((prev) => !prev)
  }

  const toggleRequestToRemoveDialog = () => {
    if (comment.length === 0) {
      setErrorMessage("Comment is required")
    } else {
      setShowRequestToRemoveDialog((prev) => !prev)
    }
  }

  const handleOnClickOk = async (templateContentId: number) => {
    void appDispatch(
      setShowRatingCommentInput({ evaluationTemplateId: templateContentId, showInput: true })
    )
    toggleDialog(templateContentId)
  }

  const handleOnClickStar = async (
    answerOptionId: number,
    evaluationTemplateId: number,
    ratingSequenceNumber: number,
    ratingAnswerType: string,
    ratingComment?: string
  ) => {
    if (ratingAnswerType === AnswerType.NA && ratingComment === undefined) {
      const isNa = true
      handleSetRatingTemplate(isNa)
      toggleDialog(evaluationTemplateId)
      void appDispatch(setShowRatingCommentInput({ evaluationTemplateId, showInput: false }))
    }
    setErrorMessage(null)
    setRatingCommentErrorMessage(null)
    if (evaluation_id !== undefined) {
      void appDispatch(
        updateEvaluationRatingById({
          evaluationTemplateId,
          answerOptionId,
          ratingSequenceNumber,
          ratingAnswerType,
          ratingComment,
        })
      )
      void appDispatch(setIsEditing(true))
    }
  }

  const handleTextAreaChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    if (evaluation?.comments === null || value !== evaluation?.comments) {
      void appDispatch(setIsEditing(true))
    }
    setComment(value)
    setErrorMessage(null)
    setRatingCommentErrorMessage(null)
  }

  const handleRecommendationChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    setRecommendation(value)
  }

  const handleClickSaveAndSubmit = () => {
    if ((isRatingHigh && comment.length === 0) || (isRatingLow && comment.length === 0)) {
      const isNA = false
      handleSetRatingTemplate(isNA)
      toggleDialog(evaluation_template_contents[0].id)
      setErrorMessage("Comment is required.")
      return
    }
    if (
      evaluation_template_contents.some(
        (evaluation_template_content) =>
          evaluation_template_content.evaluationRating.answer_option_id === null
      )
    ) {
      void appDispatch(
        appDispatch(
          setAlert({
            description: "Please set all ratings",
            variant: "destructive",
          })
        )
      )
      return
    }
    if (
      evaluation_template_contents.some(
        (evaluation_template_content) =>
          evaluation_template_content.evaluationRating.answer_option_id === 1 &&
          evaluation_template_content.evaluationRating.comments === ""
      )
    ) {
      setRatingCommentErrorMessage("Comment on N/A is required.")
      return
    }
    setShowSubmitDialog(true)
  }

  const handleSubmit = async (is_submitting: boolean) => {
    if (
      is_submitting &&
      ((isRatingHigh && comment.length === 0) || (isRatingLow && comment.length === 0))
    ) {
      const isNA = false
      handleSetRatingTemplate(isNA)
      toggleDialog(evaluation_template_contents[0].id)
      setErrorMessage("Comment is required.")
    } else if (evaluation_id !== undefined && id !== undefined) {
      try {
        const evaluation_rating_ids = evaluation_template_contents.map(
          (content) => content.evaluationRating.id
        )
        const answer_option_ids = evaluation_template_contents.map(
          (content) => content.evaluationRating.answer_option_id
        )
        const evaluation_rating_comments = evaluation_template_contents.map(
          (content) => content.evaluationRating.comments
        )
        const result = await appDispatch(
          submitEvaluation({
            evaluation_id: parseInt(evaluation_id),
            evaluation_rating_ids,
            evaluation_rating_comments,
            answer_option_ids,
            comment,
            recommendation,
            is_submitting,
          })
        )
        if (result.type === "user/submitEvaluation/fulfilled") {
          setComment(result.payload.comment)
          void appDispatch(setIsEditing(false))
          void appDispatch(
            setAlert({
              description: `Evaluation successfully ${is_submitting ? "submitted" : "saved"}.`,
              variant: "success",
            })
          )
          void appDispatch(
            updateEvaluationStatusById({
              id: result.payload.id,
              status: result.payload.status,
              comment,
            })
          )
          void appDispatch(setIsEditing(false))
          if (is_submitting) {
            const totalSubmitted = user_evaluations.filter(
              (evaluation) => evaluation.status === EvaluationStatus.Submitted
            ).length
            if (user_evaluations.length === totalSubmitted + 1) {
              setShowCompletedDialog(true)
              setCompleted(true)
            }
          }
        } else if (result.type === "user/submitEvaluation/rejected") {
          void appDispatch(
            appDispatch(
              setAlert({
                description: result.payload,
                variant: "destructive",
              })
            )
          )
          setRatingCommentErrorMessage(result.payload)
        }
      } catch (error) {}
    }
  }

  const handleRequestToRemove = async () => {
    if (evaluation !== undefined) {
      try {
        const result = await appDispatch(
          sendRequestToRemove({ evaluation_id: evaluation?.id, comment })
        )
        if (result.type === "user/sendRequestToRemove/fulfilled") {
          void appDispatch(
            updateEvaluationStatusById({
              id: result.payload.id,
              status: result.payload.status,
              comment,
            })
          )
          void appDispatch(setIsEditing(false))
        }
      } catch (error) {}
    }
  }

  return (
    <>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled && evaluation_template_contents === null && (
        <div>Not found</div>
      )}
      {loading === Loading.Fulfilled &&
        evaluation_template_contents.length > 0 &&
        user_evaluations.length > 0 && (
          <div className='flex flex-col overflow-y-scroll pr-5 pb-5 mx-4 md:w-3/4'>
            <div className='text-xl font-bold text-primary-500 mb-1'>
              <p>
                {evaluation?.evaluee?.last_name}
                {", "} {evaluation?.evaluee?.first_name}
              </p>
            </div>
            <p className='text-base font-bold mb-1'>
              {evaluation?.project !== null ? (
                <>
                  {evaluation?.project?.name} [{evaluation?.project_role?.short_name}] -{" "}
                  {evaluation?.template?.display_name}
                </>
              ) : (
                <>{evaluation?.template?.display_name}</>
              )}
            </p>
            <p className='mb-4 text-sm'>
              Evaluation Period:{" "}
              {formatDateRange(evaluation?.eval_start_date, evaluation?.eval_end_date)}
            </p>
            {evaluation_template_contents.map((templateContent) => (
              <div key={templateContent.id} className='hover:bg-primary-50'>
                <div className='flex justify-between py-3'>
                  <div className='w-4/6 mr-5'>
                    <h1 className='text-base font-medium text-primary-500'>
                      {templateContent.name}
                    </h1>
                    <p className='text-sm'>{templateContent.description}</p>
                  </div>
                  <StarRating
                    templateContent={templateContent}
                    loadingAnswer={loading_answer}
                    evaluation={evaluation}
                    handleOnClick={handleOnClickStar}
                    error={ratingCommentErrorMessage}
                  />
                </div>
                <Dialog open={showDialog[templateContent.id]} size='medium' maxWidthMin={true}>
                  <Dialog.Title>{dialogMessage?.subject}</Dialog.Title>
                  <Dialog.Description>
                    <pre className='font-sans whitespace-pre-wrap break-words'>
                      {dialogMessage?.content}
                    </pre>
                  </Dialog.Description>
                  <Dialog.Actions>
                    <Button
                      variant='primary'
                      onClick={async () => await handleOnClickOk(templateContent.id)}
                    >
                      Ok
                    </Button>
                  </Dialog.Actions>
                </Dialog>
              </div>
            ))}
            <h2 className='text-lg font-bold text-primary-500 mt-10 mb-2'>Comments</h2>
            {evaluation?.status === EvaluationStatus.Submitted ||
              (evaluation?.status === EvaluationStatus.ForRemoval &&
                (evaluation?.comments === null || evaluation?.comments === "") && (
                  <div>No comments</div>
                ))}
            {evaluation?.status !== EvaluationStatus.Submitted &&
            evaluation?.status !== EvaluationStatus.ForRemoval ? (
              <>
                <TextArea
                  name='remarks'
                  placeholder='Comments'
                  value={comment}
                  onChange={handleTextAreaChange}
                  disabled={loading_comment === Loading.Pending}
                  error={errorMessage}
                />
              </>
            ) : (
              <p>{comment}</p>
            )}
            {evaluation?.template?.with_recommendation === true && (
              <h2 className='text-lg font-bold text-primary-500 mt-10 mb-2'>Recommendations</h2>
            )}
            {evaluation?.template?.with_recommendation === true && (
              <>
                {evaluation?.status !== EvaluationStatus.Submitted ? (
                  <>
                    <TextArea
                      name='recommendations'
                      placeholder='Recommendations'
                      value={recommendation}
                      onChange={handleRecommendationChange}
                    />
                  </>
                ) : (
                  <p>{recommendation}</p>
                )}
              </>
            )}
            {evaluation?.status !== EvaluationStatus.Submitted && (
              <div className='flex justify-between my-4'>
                {(evaluation?.status === EvaluationStatus.Open ||
                  evaluation?.status === EvaluationStatus.Ongoing) && (
                  <>
                    <div className='flex gap-4'>
                      <Button variant='destructiveOutline' onClick={toggleRequestToRemoveDialog}>
                        Request to Remove
                      </Button>
                    </div>
                    <div className='flex gap-4'>
                      <Button
                        disabled={!is_editing}
                        variant='primaryOutline'
                        onClick={toggleSaveDialog}
                      >
                        Save
                      </Button>
                      <Button onClick={handleClickSaveAndSubmit}>Save & Submit</Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      <Dialog open={showSaveDialog}>
        <Dialog.Title>Save Evaluation</Dialog.Title>
        <Dialog.Description>Are you sure you want to save this evaluation?</Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={toggleSaveDialog}>
            No
          </Button>
          <Button
            variant='primary'
            onClick={async () => {
              toggleSaveDialog()
              await handleSubmit(false)
            }}
          >
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
      <Dialog open={showSubmitDialog}>
        <Dialog.Title>Submit Evaluation</Dialog.Title>
        <Dialog.Description>Are you sure you want to submit this evaluation?</Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={toggleSubmitDialog}>
            No
          </Button>
          <Button
            variant='primary'
            onClick={async () => {
              toggleSubmitDialog()
              await handleSubmit(true)
            }}
          >
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
      <Dialog open={showCompletedDialog}>
        <Dialog.Title>{emailTemplate?.subject}</Dialog.Title>
        <Dialog.Description>{emailTemplate?.content}</Dialog.Description>
        <Dialog.Actions>
          <Button variant='primary' onClick={toggleCompletedDialog}>
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
      <Dialog open={showRequestToRemoveDialog}>
        <Dialog.Title>Request to Remove</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to request for the removal of this evaluation? If you proceed, your
          ratings won&apos;t be saved, and the evaluation will be marked for removal.
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primary' onClick={toggleRequestToRemoveDialog}>
            No
          </Button>
          <Button
            variant='primary'
            onClick={async () => {
              toggleRequestToRemoveDialog()
              await handleRequestToRemove()
            }}
          >
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
      {completed && <ReactConfetti />}
    </>
  )
}
