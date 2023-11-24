import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "../../../components/button/Button"
import { StarRating } from "../../../components/rating/StarRating"
import {
  getEvaluationTemplateContents,
  updateEvaluationRatingById,
  setIsEditing,
} from "../../../redux/slices/evaluation-template-contents-slice"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { submitEvaluation, updateEvaluationStatusById } from "../../../redux/slices/user-slice"
import { Loading } from "../../../types/loadingType"
import { setAlert } from "../../../redux/slices/appSlice"
import { EvaluationStatus, type Evaluation } from "../../../types/evaluation-type"
import { formatDateRange } from "../../../utils/format-date"
import { TextArea } from "../../../components/textarea/TextArea"
import Dialog from "../../../components/dialog/Dialog"
import { AnswerType } from "../../../types/answer-option-type"
import { getNARatingTemplates } from "../../../redux/slices/email-template-slice"
import { type EmailTemplate } from "../../../types/email-template-type"

export const EvaluationsCriteria = () => {
  const { id, evaluation_id } = useParams()
  const appDispatch = useAppDispatch()
  const { evaluation_template_contents, is_editing } = useAppSelector(
    (state) => state.evaluationTemplateContents
  )
  const { loading, loading_comment, loading_answer, user_evaluations } = useAppSelector(
    (state) => state.user
  )
  const { naRatingTemplates } = useAppSelector((state) => state.emailTemplate)

  const [evaluation, setEvaluation] = useState<Evaluation>()
  const [comment, setComment] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [naRatingTemplate, setNaRatingTemplate] = useState<EmailTemplate>()
  const [currentNATemplateIndex, setCurrentNATemplateIndex] = useState<number>(0)

  useEffect(() => {
    void appDispatch(setIsEditing(false))
  }, [evaluation_id])

  useEffect(() => {
    void appDispatch(getNARatingTemplates())
  }, [])

  useEffect(() => {
    if (evaluation_id !== "all") {
      void appDispatch(
        getEvaluationTemplateContents({
          evaluation_id,
        })
      )
      setEvaluation(
        user_evaluations?.find((evaluation) => evaluation.id === parseInt(evaluation_id as string))
      )
    }
  }, [evaluation_id, user_evaluations])

  useEffect(() => {
    setErrorMessage(null)
    if (evaluation?.comments !== undefined && evaluation?.comments !== null) {
      setComment(evaluation.comments)
    } else {
      setComment("")
    }
  }, [evaluation])

  const handleSetNaRatingTemplate = () => {
    if (naRatingTemplates.length > 0) {
      if (naRatingTemplates.length > 0) {
        const nextIndex = (currentNATemplateIndex + 1) % naRatingTemplates.length

        const nextTemplate = naRatingTemplates[nextIndex]

        setNaRatingTemplate(nextTemplate)
        setCurrentNATemplateIndex(nextIndex)
      }
    }
  }

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }

  const handleOnClickStar = async (
    answerOptionId: number,
    evaluationTemplateId: number,
    ratingSequenceNumber: number,
    ratingAnswerType: string,
    ratingComment?: string
  ) => {
    if (ratingAnswerType === AnswerType.NA && ratingComment === undefined) {
      handleSetNaRatingTemplate()
      toggleDialog()
    }
    setErrorMessage(null)
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
  }

  const handleSubmit = async (is_submitting: boolean) => {
    if (evaluation_id !== undefined && id !== undefined) {
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
        } else if (result.type === "user/submitEvaluation/rejected") {
          void appDispatch(
            appDispatch(
              setAlert({
                description: result.payload,
                variant: "destructive",
              })
            )
          )
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
        evaluation_template_contents !== null &&
        user_evaluations.length > 0 && (
          <div className='flex flex-col overflow-y-scroll pr-5 mx-4 md:w-3/4'>
            <div className='text-xl font-bold text-primary-500 mb-1'>
              <p>
                {evaluation?.evaluee?.last_name}
                {", "} {evaluation?.evaluee?.first_name}
              </p>
            </div>
            {evaluation?.project === null ? (
              <p className='text-base font-bold mb-1'>
                {evaluation.template?.project_role?.name !== undefined
                  ? evaluation.template?.project_role?.name
                  : evaluation.template?.display_name ?? ""}
              </p>
            ) : (
              <p className='text-base font-bold mb-1'>
                {evaluation?.project?.name} [{evaluation?.project_role?.short_name}]
              </p>
            )}
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
                  />
                </div>
              </div>
            ))}
            <h1 className='text-lg font-bold text-primary-500 mt-10 mb-2'>Comments</h1>
            {evaluation?.status === EvaluationStatus.Submitted &&
              (evaluation?.comments === null || evaluation?.comments === "") && (
                <div>No comments</div>
              )}
            {evaluation?.status !== EvaluationStatus.Submitted ? (
              <>
                <TextArea
                  name='remarks'
                  placeholder='Comments'
                  value={comment}
                  onChange={handleTextAreaChange}
                  disabled={loading_comment === Loading.Pending}
                  error={errorMessage}
                />
                <div className='flex justify-end my-4 gap-4'>
                  <Button
                    disabled={!is_editing}
                    variant='primaryOutline'
                    onClick={async () => await handleSubmit(false)}
                  >
                    Save
                  </Button>
                  <Button onClick={async () => await handleSubmit(true)}>Save & Submit</Button>
                </div>
              </>
            ) : (
              <p className='mb-10'>{comment}</p>
            )}
          </div>
        )}
      <Dialog open={showDialog}>
        <Dialog.Title>{naRatingTemplate?.subject}</Dialog.Title>
        <Dialog.Description>{naRatingTemplate?.content}</Dialog.Description>
        <Dialog.Actions>
          <Button variant='primary' onClick={toggleDialog}>
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}
