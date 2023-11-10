import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Icon } from "../../../components/icon/Icon"
import { Button } from "../../../components/button/Button"
import { getEvaluationTemplateContents } from "../../../redux/slices/evaluationTemplateContentsSlice"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { AnswerOptions } from "../../../types/answerOptionType"
import {
  submitAnswer,
  submitComment,
  submitEvaluation,
  getUserEvaluations,
} from "../../../redux/slices/userSlice"
import { Loading } from "../../../types/loadingType"
import { setAlert } from "../../../redux/slices/appSlice"
import {
  EvaluationStatus,
  type Evaluation,
} from "../../../types/evaluationType"
import { formatDate } from "../../../utils/formatDate"
import { TextArea } from "../../../components/textarea/TextArea"
import { getAnswerOptionVariant } from "../../../utils/variant"

export const EvaluationsCriteria = () => {
  const { id, evaluation_id } = useParams()
  const appDispatch = useAppDispatch()
  const { evaluation_template_contents } = useAppSelector(
    (state) => state.evaluationTemplateContents
  )
  const { loading, loading_answer, loading_comment, user_evaluations } =
    useAppSelector((state) => state.user)
  const [evaluation, setEvaluation] = useState<Evaluation>()
  const [comments, setComments] = useState<string>("")

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
    if (evaluation?.comments !== undefined && evaluation?.comments !== null) {
      setComments(evaluation.comments)
    } else {
      setComments("")
    }
  }, [evaluation])

  const handleOnClickStar = async (
    answerOptionId: number,
    evaluationRatingId: number
  ) => {
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
            getEvaluationTemplateContents({
              evaluation_id,
            })
          )
          void appDispatch(
            getUserEvaluations({
              evaluation_administration_id: parseInt(id),
              for_evaluation: true,
            })
          )
        }
        if (typeof result === "string") {
          void appDispatch(
            setAlert({
              description: result,
              variant: "destructive",
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
    setComments(value)
  }

  const handleOnBlur = async (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    if (evaluation_id !== undefined && id !== undefined) {
      try {
        const result = await appDispatch(
          submitComment({
            evaluation_id: parseInt(evaluation_id),
            comment: value,
          })
        )
        if (typeof result.payload === "string") {
          void appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        } else if (result.payload !== undefined) {
          setComments(result.payload.comment)
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
        if (typeof result.payload === "string") {
          void appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        } else if (result.payload !== undefined) {
          void appDispatch(
            setAlert({
              description: `Evaluation successfully submitted.`,
              variant: "success",
            })
          )
          void appDispatch(
            getUserEvaluations({
              evaluation_administration_id: parseInt(id),
              for_evaluation: true,
            })
          )
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
                <div className='flex flex-row items-center'>
                  {templateContent.answerOptions !== undefined &&
                    templateContent.answerId ===
                      AnswerOptions.FivePointStarRating && (
                      <>
                        {templateContent.answerOptions.map((answerOption) => {
                          return (
                            <div key={answerOption.id}>
                              {templateContent.evaluationRating === null ? (
                                <h1>Rating not found</h1>
                              ) : (
                                <>
                                  <Button
                                    testId={`OptionButton${answerOption.id}`}
                                    key={answerOption.id}
                                    disabled={
                                      loading_answer === Loading.Pending ||
                                      evaluation?.status ===
                                        EvaluationStatus.Submitted
                                    }
                                    variant={getAnswerOptionVariant(
                                      answerOption.sequence_no,
                                      templateContent.evaluationRating
                                        .ratingSequenceNumber
                                    )}
                                    onClick={async () =>
                                      await handleOnClickStar(
                                        answerOption.id,
                                        templateContent.evaluationRating.id
                                      )
                                    }
                                    size='small'
                                  >
                                    {answerOption.sequence_no === 1 ? (
                                      "N/A"
                                    ) : (
                                      <Icon icon='Star' />
                                    )}
                                  </Button>
                                </>
                              )}
                            </div>
                          )
                        })}
                      </>
                    )}
                </div>
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
                  value={comments}
                  onChange={handleTextAreaChange}
                  onBlur={handleOnBlur}
                  disabled={loading_comment === Loading.Pending}
                  error={
                    evaluation_template_contents.every(
                      (rating) =>
                        rating.evaluationRating?.ratingSequenceNumber === 2
                    ) && comments.length <= 0
                      ? "Comment is required"
                      : undefined
                  }
                />
                <div className='flex justify-end'>
                  <Button
                    onClick={async () => await handleSubmit()}
                    disabled={evaluation_template_contents.every((rating) => {
                      return (
                        rating.evaluationRating?.ratingSequenceNumber === 2 &&
                        comments.length === 0
                      )
                    })}
                  >
                    Submit
                  </Button>
                </div>
              </>
            ) : (
              <p>{comments}</p>
            )}
          </div>
        )}
    </>
  )
}
