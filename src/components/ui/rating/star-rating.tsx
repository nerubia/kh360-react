import { useState, useEffect } from "react"
import { Icon } from "../icon/icon"
import { getAnswerOptionVariant } from "../../../utils/variant"
import { AnswerOptions, AnswerType } from "../../../types/answer-option-type"
import { EvaluationStatus, type Evaluation } from "../../../types/evaluation-type"
import { Loading } from "../../../types/loadingType"
import { type EvaluationTemplateContent } from "../../../types/evaluation-template-content-type"
import {
  updateEvaluationRatingById,
  updateEvaluationRatingCommentById,
  setIsEditing,
  setShowRatingCommentInput,
} from "../../../redux/slices/evaluation-template-contents-slice"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { Button } from "../button/button"
import Tooltip from "../tooltip/tooltip"
import { TextArea } from "../../../components/ui/textarea/text-area"
import useMobileView from "../../../hooks/use-mobile-view"
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
  error: string | null
}

export const StarRating = ({
  templateContent,
  loadingAnswer,
  evaluation,
  handleOnClick,
  error,
}: StarRatingProps) => {
  const appDispatch = useAppDispatch()
  const [comment, setComment] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isMobile = useMobileView()
  const handleSaveComment = async (templateContentId: number) => {
    void appDispatch(
      updateEvaluationRatingCommentById({
        evaluationTemplateId: templateContentId,
        ratingComment: comment,
      })
    )
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    void appDispatch(setIsEditing(true))
    setComment(value)
    setErrorMessage(null)
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
  }

  useEffect(() => {
    setComment(templateContent.evaluationRating.comments ?? "")
    if (templateContent.evaluationRating.comments?.length === 0) {
      void appDispatch(
        setShowRatingCommentInput({ evaluationTemplateId: templateContent.id, showInput: true })
      )
    }
  }, [templateContent])

  useEffect(() => {
    if (error !== null && comment.length === 0) {
      setErrorMessage(error)
    } else {
      setErrorMessage(null)
    }
  }, [error])

  return (
    <div className='flex flex-row items-start justify-start w-60'>
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
                            <Tooltip placement={`${isMobile ? "topStart" : "topEnd"}`}>
                              <Tooltip.Trigger>
                                <Button
                                  testId={`OptionButton${answerOption.id}`}
                                  key={answerOption.id}
                                  disabled={
                                    loadingAnswer === Loading.Pending ||
                                    evaluation?.status === EvaluationStatus.Submitted ||
                                    evaluation?.status === EvaluationStatus.ForRemoval
                                  }
                                  variant={getAnswerOptionVariant(
                                    answerOption.sequence_no,
                                    templateContent.evaluationRating.ratingSequenceNumber,
                                    answerOption.answer_type
                                  )}
                                  onClick={
                                    templateContent.evaluationRating.ratingAnswerType ===
                                    AnswerType.NA
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
                              </Tooltip.Trigger>
                              <Tooltip.Content>
                                <p>
                                  <b>{answerOption.display_name}</b>
                                </p>
                                {answerOption.description}
                              </Tooltip.Content>
                            </Tooltip>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
                {templateContent.evaluationRating.ratingAnswerType === AnswerType.NA &&
                  evaluation?.status !== EvaluationStatus.Submitted &&
                  evaluation?.status !== EvaluationStatus.ForRemoval &&
                  (templateContent.evaluationRating.showInputComment === true ||
                    comment.length > 0) && (
                    <div className='flex gap-2'>
                      <div className='w-48 text-xs'>
                        <TextArea
                          name='comment'
                          placeholder='Comments'
                          value={comment}
                          onChange={handleInputChange}
                          onBlur={async () => await handleSaveComment(templateContent.id)}
                          autoFocus={true}
                          error={errorMessage}
                          maxLength={500}
                        />
                      </div>
                    </div>
                  )}
                {(evaluation?.status === EvaluationStatus.Submitted ||
                  evaluation?.status === EvaluationStatus.ForRemoval) && (
                  <p className='text-xs'> {comment} </p>
                )}
              </>
            </div>
          </div>
        )}
    </div>
  )
}
