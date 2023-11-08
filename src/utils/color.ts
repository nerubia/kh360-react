import { EvaluationResultStatus } from "../types/evaluationResultType"

export const getEvaluationResultStatusColor = (status: string | undefined) => {
  if (status === EvaluationResultStatus.ForReview) {
    return "pink"
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
