import { EvaluationResultStatus } from "../types/evaluationResultType"

export const getEvaluationResultStatusVariant = (
  status: string | undefined
) => {
  if (status === EvaluationResultStatus.ForReview) {
    return "greenOutline"
  }
  if (status === EvaluationResultStatus.Draft) {
    return "yellow"
  }
  if (status === EvaluationResultStatus.Ready) {
    return "green"
  }
  if (status === EvaluationResultStatus.Completed) {
    return "blue"
  }
}
