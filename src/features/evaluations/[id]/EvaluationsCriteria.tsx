import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "../../../components/button/Button"
import { StarRating } from "../../../components/rating/StarRating"
import {
  getEvaluationTemplateContents,
  updateEvaluationRatingById,
} from "../../../redux/slices/evaluationTemplateContentsSlice"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import {
  submitAnswer,
  submitComment,
  submitEvaluation,
  updateEvaluationStatusById,
} from "../../../redux/slices/userSlice"
import { Loading } from "../../../types/loadingType"
import { setAlert } from "../../../redux/slices/appSlice"
import {
  EvaluationStatus,
  type Evaluation,
} from "../../../types/evaluationType"
import { formatDate } from "../../../utils/formatDate"
import { TextArea } from "../../../components/textarea/TextArea"

export const EvaluationsCriteria = () => {
  const { id, evaluation_id } = useParams()
  const appDispatch = useAppDispatch()
  const { evaluation_template_contents } = useAppSelector(
    (state) => state.evaluationTemplateContents
  )
  const { loading, loading_comment, loading_answer, user_evaluations } =
    useAppSelector((state) => state.user)
  const [evaluation, setEvaluation] = useState<Evaluation>()
  const [comment, setComment] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (evaluation_id !== "all") {
      void appDispatch(
        getEvaluationTemplateContents({
          evaluation_id,
        })
      )
      setEvaluation(
        user_evaluations?.find(
          (evaluation) => evaluation.id === parseInt(evaluation_id as string)
        )
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
    evaluationRatingId: number,
    evaluationTemplateId: number,
    ratingSequenceNumber: number
  ) => {
    setErrorMessage(null)
    if (evaluation_id !== undefined) {
      try {
        const result = await appDispatch(
          submitAnswer({
            evaluation_id: parseInt(evaluation_id),
            evaluation_rating_id: evaluationRatingId,
            answer_option_id: answerOptionId,
          })
        )
        if (result.payload.id !== undefined && id !== undefined) {
          void appDispatch(
            updateEvaluationStatusById({
              id: result.payload.id,
              status: result.payload.status,
              comment,
            })
          )
          void appDispatch(
            updateEvaluationRatingById({
              evaluationTemplateId,
              answerOptionId,
              ratingSequenceNumber,
            })
          )
        }
      } catch (error) {}
    }
  }

  const handleTextAreaChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = e.target
    setComment(value)
    setErrorMessage(null)
  }

  const handleOnBlur = async (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    if (evaluation_id !== undefined && id !== undefined && value.length > 0) {
      try {
        const result = await appDispatch(
          submitComment({
            evaluation_id: parseInt(evaluation_id),
            comment: value,
          })
        )
        if (result.payload !== undefined) {
          setComment(result.payload.comment)
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
        const result = await appDispatch(
          submitEvaluation(parseInt(evaluation_id))
        )
        if (
          result.payload !== undefined &&
          result.type === "user/submitEvaluation/fulfilled"
        ) {
          void appDispatch(
            setAlert({
              description: `Evaluation successfully submitted.`,
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
        } else if (result.type === "user/submitEvaluation/rejected") {
          setErrorMessage(result.payload)
        }
      } catch (error) {}
    }
  }

  return (
    <>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled &&
        evaluation_template_contents === null && <div>Not found</div>}
      {loading === Loading.Fulfilled &&
        evaluation_template_contents !== null &&
        user_evaluations.length > 0 && (
          <div className='w-full flex flex-col gap-4 overflow-y-scroll'>
            <div className='text-lg font-bold'>
              <h1>Project Assignment Duration</h1>(
              {formatDate(evaluation?.eval_start_date)} to{" "}
              {formatDate(evaluation?.eval_end_date)})
            </div>
            {evaluation_template_contents.map((templateContent) => (
              <div
                className={`flex justify-between ${
                  templateContent.evaluationRating !== null &&
                  templateContent.evaluationRating.ratingSequenceNumber === 1 &&
                  `text-gray-200`
                }`}
                key={templateContent.id}
              >
                <div className='w-1/2'>
                  <h1 className='text-lg font-medium'>
                    {templateContent.name}
                  </h1>
                  <p>{templateContent.description}</p>
                </div>
                <StarRating
                  templateContent={templateContent}
                  loadingAnswer={loading_answer}
                  evaluation={evaluation}
                  handleOnClick={handleOnClickStar}
                />
              </div>
            ))}
            <h1 className='text-lg font-bold'>Comments</h1>
            {evaluation?.status === EvaluationStatus.Submitted &&
              evaluation?.comments === null && <div>No comments</div>}
            {evaluation?.status !== EvaluationStatus.Submitted ? (
              <>
                <TextArea
                  label='Evaluation description/notes'
                  name='remarks'
                  placeholder='Comments'
                  value={comment}
                  onChange={handleTextAreaChange}
                  onBlur={handleOnBlur}
                  disabled={loading_comment === Loading.Pending}
                  error={errorMessage}
                />
                <div className='flex justify-end'>
                  <Button onClick={async () => await handleSubmit()}>
                    Submit
                  </Button>
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
