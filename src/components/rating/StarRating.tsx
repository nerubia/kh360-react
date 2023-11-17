import { Icon } from "../../components/icon/Icon"
import { getAnswerOptionVariant } from "../../utils/variant"
import { Button } from "../../components/button/Button"
import { AnswerOptions } from "../../types/answerOptionType"
import { EvaluationStatus, type Evaluation } from "../../types/evaluation-type"
import { Loading } from "../../types/loadingType"
import { type EvaluationTemplateContent } from "../../types/evaluationTemplateContentType"

interface StarRatingProps {
  templateContent: EvaluationTemplateContent
  loadingAnswer: Loading
  evaluation?: Evaluation | null
  handleOnClick: (
    id: number,
    templateContentId: number,
    ratingSequenceNumber: number
  ) => Promise<void>
}

export const StarRating = ({
  templateContent,
  loadingAnswer,
  evaluation,
  handleOnClick,
}: StarRatingProps) => (
  <div className='flex flex-row items-center'>
    {templateContent.answerOptions !== undefined &&
      templateContent.answerId === AnswerOptions.FivePointStarRating && (
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
                        loadingAnswer === Loading.Pending ||
                        evaluation?.status === EvaluationStatus.Submitted
                      }
                      variant={getAnswerOptionVariant(
                        answerOption.sequence_no,
                        templateContent.evaluationRating.ratingSequenceNumber
                      )}
                      onClick={async () =>
                        await handleOnClick(
                          answerOption.id,
                          templateContent.id,
                          answerOption.sequence_no
                        )
                      }
                      size='small'
                    >
                      {answerOption.sequence_no === 1 ? "N/A" : <Icon icon='Star' />}
                    </Button>
                  </>
                )}
              </div>
            )
          })}
        </>
      )}
  </div>
)
