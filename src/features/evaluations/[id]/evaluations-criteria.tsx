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
  updateTotalSubmitted,
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
import { type EvaluationTemplateContent } from "../../../types/evaluation-template-content-type"
import { Badge } from "../../../components/ui/badge/badge"
import { getEvaluationStatusVariant } from "../../../utils/variant"
import useSmoothScrollToTop from "../../../hooks/use-smooth-scroll-to-top"

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
  const [similarEvaluations, setSimilarEvaluations] = useState<Evaluation[]>([])
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
  const [showSimilarEvaluationsDialog, setShowSimilarEvaluationsDialog] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)

  const [evaluationRatingIds, setEvaluationRatingIds] = useState<number[]>([])
  const [didCopy, setDidCopy] = useState<boolean>(false)
  const scrollToTop = useSmoothScrollToTop()

  useEffect(() => {
    void appDispatch(setIsEditing(false))
    setDidCopy(false)
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
          if (result.type === "evaluationTemplate/getEvaluationTemplateContents/fulfilled") {
            const evaluationTemplateContents = result.payload as EvaluationTemplateContent[]
            setEvaluationRatingIds(
              evaluationTemplateContents.map((content) => content.evaluationRating.id)
            )
          }
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
    const similarUserEvaluations = user_evaluations.filter((userEvaluation) => {
      if (
        evaluation?.id !== userEvaluation.id &&
        evaluation?.status !== EvaluationStatus.Submitted &&
        evaluation?.template?.id === userEvaluation.template?.id &&
        evaluation?.evaluee?.id === userEvaluation.evaluee?.id &&
        evaluation?.project?.id === userEvaluation.project?.id &&
        userEvaluation.status === EvaluationStatus.Submitted
      ) {
        return userEvaluation
      }
      return null
    })
    setSimilarEvaluations(similarUserEvaluations)
    if (similarUserEvaluations.length > 0) {
      setShowSimilarEvaluationsDialog(true)
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
    scrollToTop()
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
      scrollToTop()
    }
  }

  const toggleSimilarEvaluationsDialog = () => {
    setDidCopy(true)
    setShowSimilarEvaluationsDialog((prev) => !prev)
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
    scrollToTop()
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
        const answer_option_ids = evaluation_template_contents.map(
          (content) => content.evaluationRating.answer_option_id
        )
        const evaluation_rating_comments = evaluation_template_contents.map(
          (content) => content.evaluationRating.comments
        )
        const result = await appDispatch(
          submitEvaluation({
            evaluation_id: parseInt(evaluation_id),
            evaluation_rating_ids: evaluationRatingIds,
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
          if (id !== undefined) {
            appDispatch(updateTotalSubmitted({ id }))
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

  const handleGetTemplateContents = (evaluation: Evaluation) => {
    void appDispatch(
      getEvaluationTemplateContents({
        evaluation_id: evaluation.id.toString(),
      })
    )
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
    void appDispatch(setIsEditing(true))
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
          <div className='flex flex-col w-full pb-5 pr-5 mx-4 mb-3 overflow-y-scroll md:w-3/4'>
            <div className='items-center justify-between p-1 border rounded sm:flex sm:flex-col md:flex-row md:border-none md:p-0'>
              <div className='flex-flex-col'>
                <div className='mb-1 text-xl font-bold text-primary-500'>
                  <p>
                    {evaluation?.evaluee?.last_name}
                    {", "} {evaluation?.evaluee?.first_name}
                  </p>
                </div>
                <p className='mb-1 text-base font-bold'>
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
              </div>
              <span className='flex justify-between justify-items-center'>
                <div className='block mt-2 uppercase md:hidden'>
                  <Badge variant={getEvaluationStatusVariant(evaluation?.status)} size='small'>
                    {evaluation?.status}
                  </Badge>
                </div>
                {similarEvaluations.length > 0 && (
                  <Button variant='primaryOutline' onClick={toggleSimilarEvaluationsDialog}>
                    <span className='text-sm sm:text-base'> Copy Evaluation</span>
                  </Button>
                )}
              </span>
            </div>
            {evaluation_template_contents.map((templateContent) => (
              <div
                key={templateContent.id}
                className='rounded-md hover:bg-primary-50 sm:mt-1 md:mt-0'
              >
                <div className='flex flex-col p-4 h-fit md:flex-row'>
                  <div className='w-full mr-5 md:w-9/12'>
                    <h1 className='mb-3 md:mb-0 text-base font-medium text-primary-500'>
                      {templateContent.name}
                    </h1>
                    <p className='mb-2 text-sm'>{templateContent.description}</p>
                  </div>
                  <span className='inline-block w-full md:w-auto'>
                    <StarRating
                      templateContent={templateContent}
                      loadingAnswer={loading_answer}
                      evaluation={evaluation}
                      handleOnClick={handleOnClickStar}
                      error={ratingCommentErrorMessage}
                    />
                  </span>
                </div>
                <Dialog open={showDialog[templateContent.id]} size='medium' maxWidthMin={true}>
                  <Dialog.Title>{dialogMessage?.subject}</Dialog.Title>
                  <Dialog.Description>
                    <pre className='font-sans break-words whitespace-pre-wrap'>
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
            <h2 className='mt-10 mb-2 text-lg font-bold text-primary-500'>Comments</h2>
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
              <pre className='font-sans break-words whitespace-pre-wrap'>{comment}</pre>
            )}
            {evaluation?.template?.with_recommendation === true && (
              <h2 className='mt-10 mb-2 text-lg font-bold text-primary-500'>Recommendations</h2>
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
                    <div className='hidden w-full md:block'>
                      <div className='flex justify-between'>
                        <div className='flex gap-4'>
                          <Button
                            variant='destructiveOutline'
                            onClick={toggleRequestToRemoveDialog}
                          >
                            <span className='text-sm sm:text-base'>Request to Remove</span>
                          </Button>
                        </div>
                        <div className='flex gap-4 ml-2'>
                          <Button
                            disabled={!is_editing}
                            variant='primaryOutline'
                            onClick={toggleSaveDialog}
                          >
                            Save
                          </Button>
                          <Button onClick={handleClickSaveAndSubmit}>
                            <span className='text-sm sm:text-base'>Save & Submit</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className='block w-full ml-0 md:hidden'>
                      <div className='flex w-full gap-4 m-2 ml-0'>
                        <Button onClick={handleClickSaveAndSubmit} fullWidth>
                          <span className='text-sm sm:text-base'>Save & Submit</span>
                        </Button>
                      </div>
                      <div className='flex w-full gap-4 m-2 ml-0'>
                        <Button
                          disabled={!is_editing}
                          fullWidth
                          variant='primaryOutline'
                          onClick={toggleSaveDialog}
                        >
                          Save
                        </Button>
                      </div>
                      <div className='flex w-full gap-4 m-2 ml-0'>
                        <Button
                          variant='destructiveOutline'
                          fullWidth
                          onClick={toggleRequestToRemoveDialog}
                        >
                          <span className='text-sm sm:text-base'>Request to Remove</span>
                        </Button>
                      </div>
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
      <Dialog open={showCompletedDialog} size='medium' maxWidthMin={true}>
        <Dialog.Title>{emailTemplate?.subject}</Dialog.Title>
        <Dialog.Description>
          <pre className='font-sans break-words whitespace-pre-wrap'>{emailTemplate?.content}</pre>
        </Dialog.Description>
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
      <Dialog open={showSimilarEvaluationsDialog}>
        <Dialog.Title>Copy Evaluation</Dialog.Title>
        <Dialog.Description>
          <div className='flex flex-col gap-4'>
            {didCopy ? (
              <p>
                Kindly select which evaluation to copy from the previously submitted evaluations for{" "}
                {evaluation?.evaluee?.last_name}, {evaluation?.evaluee?.first_name} for{" "}
                {evaluation?.project?.name} Project.
              </p>
            ) : (
              <p>
                You have already submitted an evaluation for {evaluation?.evaluee?.last_name},{" "}
                {evaluation?.evaluee?.first_name} for {evaluation?.project?.name} Project.
                <br />
                <br />
                If you want to copy the ratings from previous evaluations, select which evaluation
                below to use.
              </p>
            )}
            <div className='flex flex-col gap-2'>
              {similarEvaluations.map((similarEvaluation) => (
                <button
                  key={similarEvaluation.id}
                  onClick={() => handleGetTemplateContents(similarEvaluation)}
                >
                  <div className='flex flex-col p-2 rounded-md bg-primary-50 hover:bg-primary-100'>
                    <div className='text-sm'>
                      Copy the evaluation ratings from{" "}
                      {formatDateRange(
                        similarEvaluation?.eval_start_date,
                        similarEvaluation?.eval_end_date
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primary' onClick={toggleSimilarEvaluationsDialog}>
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
      {completed && <ReactConfetti />}
    </>
  )
}
