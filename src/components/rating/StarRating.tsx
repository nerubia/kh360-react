import { useState, useEffect } from "react"
import { Icon } from "../../components/icon/Icon"
import { getAnswerOptionVariant } from "../../utils/variant"
import { Button } from "../../components/button/Button"
import { AnswerOptions, AnswerType } from "../../types/answer-option-type"
import { EvaluationStatus, type Evaluation } from "../../types/evaluation-type"
import { Loading } from "../../types/loadingType"
import { type EvaluationTemplateContent } from "../../types/evaluationTemplateContentType"
import { Input } from "../../components/input/Input"
import {
  updateEvaluationRatingById,
  updateEvaluationRatingCommentById,
} from "../../redux/slices/evaluation-template-contents-slice"
import { useAppDispatch } from "../../hooks/useAppDispatch"

interface StarRatingProps {
  templateContent: EvaluationTemplateContent
  loadingAnswer: Loading
  evaluation?: Evaluation | null
  handleOnClick: (
    id: number,
    templateContentId: number,
    ratingSequenceNumber: number,
    ratingAnswerType: string
  ) => Promise<void>
}

export const StarRating = ({
  templateContent,
  loadingAnswer,
  evaluation,
  handleOnClick,
}: StarRatingProps) => {
  const appDispatch = useAppDispatch()
  const [comment, setComment] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const handleSaveComment = async (templateContentId: number) => {
    if (comment.length === 0) {
      setError("Comment is required.")
    } else {
      void appDispatch(
        updateEvaluationRatingCommentById({
          evaluationTemplateId: templateContentId,
          ratingComment: comment,
        })
      )
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setComment(value)
    setError(null)
  }

  const handleOnClickNa = async () => {
    void appDispatch(
      updateEvaluationRatingById({
        evaluationTemplateId: templateContent.id,
        answerOptionId: null,
        ratingSequenceNumber: null,
        ratingAnswerType: null,
        ratingComment: null,
      })
    )
    setError(null)
  }

  useEffect(() => {
    setComment(templateContent.evaluationRating.comments ?? "")
  }, [templateContent])

  return (
    <div className='flex flex-row items-center w-80'>
      {templateContent.answerOptions !== undefined &&
        templateContent.answerId === AnswerOptions.FivePointStarRating && (
          <div>
            <div className='flex'>
              <>
                {templateContent.answerOptions.map((answerOption, index) => {
                  return (
                    <div key={answerOption.id}>
                      {templateContent.evaluationRating === null ? (
                        <h1>Rating not found</h1>
                      ) : (
                        <>
                          {((index === 0 &&
                            templateContent.evaluationRating.ratingAnswerType === AnswerType.NA) ||
                            templateContent.evaluationRating.ratingAnswerType !==
                              AnswerType.NA) && (
                            <Button
                              testId={`OptionButton${answerOption.id}`}
                              key={answerOption.id}
                              disabled={
                                loadingAnswer === Loading.Pending ||
                                evaluation?.status === EvaluationStatus.Submitted
                              }
                              variant={getAnswerOptionVariant(
                                answerOption.sequence_no,
                                templateContent.evaluationRating.ratingSequenceNumber,
                                answerOption.answer_type
                              )}
                              onClick={
                                templateContent.evaluationRating.ratingAnswerType === AnswerType.NA
                                  ? async () => await handleOnClickNa()
                                  : async () =>
                                      await handleOnClick(
                                        answerOption.id,
                                        templateContent.id,
                                        answerOption.sequence_no,
                                        answerOption.answer_type
                                      )
                              }
                              size='small'
                            >
                              {answerOption.answer_type === AnswerType.NA ? (
                                "N/A"
                              ) : (
                                <Icon icon='Star' />
                              )}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
                {templateContent.evaluationRating.ratingAnswerType === AnswerType.NA &&
                evaluation?.status !== EvaluationStatus.Submitted ? (
                  <div className='flex gap-2'>
                    <div className='w-48 h-1 text-xs'>
                      <Input
                        name='comment'
                        placeholder='Comments'
                        type='text'
                        value={comment}
                        onChange={handleInputChange}
                        error={error}
                        onBlur={async () => await handleSaveComment(templateContent.id)}
                      />
                    </div>
                  </div>
                ) : (
                  <p> {comment} </p>
                )}
              </>
            </div>
          </div>
        )}
    </div>
  )
}
