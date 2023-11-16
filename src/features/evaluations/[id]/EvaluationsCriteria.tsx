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
import {
  saveAnswers,
  submitEvaluation,
  updateEvaluationStatusById,
} from "../../../redux/slices/user-slice"
import { Loading } from "../../../types/loadingType"
import { setAlert } from "../../../redux/slices/appSlice"
import { EvaluationStatus, type Evaluation } from "../../../types/evaluationType"
import { formatDate } from "../../../utils/formatDate"
import { TextArea } from "../../../components/textarea/TextArea"

export const EvaluationsCriteria = () => {
  const { id, evaluation_id } = useParams()
  const appDispatch = useAppDispatch()
  const { evaluation_template_contents, is_editing } = useAppSelector(
    (state) => state.evaluationTemplateContents
  )
  const { loading, loading_comment, loading_answer, user_evaluations } = useAppSelector(
    (state) => state.user
  )
  const [evaluation, setEvaluation] = useState<Evaluation>()
  const [comment, setComment] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    void appDispatch(setIsEditing(false))
  }, [evaluation_id])

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

  const handleOnClickStar = async (
    answerOptionId: number,
    evaluationTemplateId: number,
    ratingSequenceNumber: number
  ) => {
    setErrorMessage(null)
    if (evaluation_id !== undefined) {
      void appDispatch(
        updateEvaluationRatingById({
          evaluationTemplateId,
          answerOptionId,
          ratingSequenceNumber,
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

  const handleSave = async () => {
    if (evaluation_id !== undefined) {
      try {
        const evaluation_rating_ids = evaluation_template_contents.map(
          (content) => content.evaluationRating.id
        )
        const answer_option_ids = evaluation_template_contents.map(
          (content) => content.evaluationRating.answer_option_id
        )
        const result = await appDispatch(
          saveAnswers({
            evaluation_id: parseInt(evaluation_id),
            evaluation_rating_ids,
            answer_option_ids,
            comment,
          })
        )
        if (result.payload !== undefined) {
          setComment(result.payload.comment)
          void appDispatch(setIsEditing(false))
          void appDispatch(
            updateEvaluationStatusById({
              id: result.payload.id,
              status: EvaluationStatus.Ongoing,
              comment: result.payload.comment,
            })
          )
        }
      } catch (error) {}
    }
  }

  const handleSubmit = async () => {
    if (evaluation_id !== undefined && id !== undefined) {
      try {
        const evaluation_rating_ids = evaluation_template_contents.map(
          (content) => content.evaluationRating.id
        )
        const answer_option_ids = evaluation_template_contents.map(
          (content) => content.evaluationRating.answer_option_id
        )

        const saveAnswersResult = await appDispatch(
          saveAnswers({
            evaluation_id: parseInt(evaluation_id),
            evaluation_rating_ids,
            answer_option_ids,
            comment,
          })
        )
        if (saveAnswersResult.payload !== undefined) {
          setComment(saveAnswersResult.payload.comment)
          void appDispatch(setIsEditing(false))
          const submitEvaluationResult = await appDispatch(
            submitEvaluation(parseInt(evaluation_id))
          )
          if (
            submitEvaluationResult.payload !== undefined &&
            submitEvaluationResult.type === "user/submitEvaluation/fulfilled"
          ) {
            void appDispatch(
              setAlert({
                description: `Evaluation successfully submitted.`,
                variant: "success",
              })
            )
            void appDispatch(
              updateEvaluationStatusById({
                id: submitEvaluationResult.payload.id,
                status: submitEvaluationResult.payload.status,
                comment,
              })
            )
            void appDispatch(setIsEditing(false))
          } else if (submitEvaluationResult.type === "user/submitEvaluation/rejected") {
            setErrorMessage(submitEvaluationResult.payload)
          }
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
          <div className='flex flex-col overflow-y-scroll pr-5 mr-4 w-3/4'>
            <div className='text-lg font-bold text-primary-500 mb-2'>
              <h1>Project Assignment Duration</h1>({formatDate(evaluation?.eval_start_date)} to{" "}
              {formatDate(evaluation?.eval_end_date)})
            </div>
            {evaluation_template_contents.map((templateContent) => (
              <div key={templateContent.id} className='hover:bg-primary-50'>
                <div className='flex justify-between py-3'>
                  <div className='w-4/6'>
                    <h1 className='text-lg font-medium text-primary-500'>{templateContent.name}</h1>
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
            {evaluation?.status === EvaluationStatus.Submitted && evaluation?.comments === null && (
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
                    onClick={async () => await handleSave()}
                  >
                    Save
                  </Button>
                  <Button onClick={async () => await handleSubmit()}>Save & Submit</Button>
                </div>
              </>
            ) : (
              <p>{comment}</p>
            )}
          </div>
        )}
    </>
  )
}
