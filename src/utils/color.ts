import { EvaluationResultStatus } from "../types/evaluationResultType"

export const getEvaluationResultStatusColor = (status: string | undefined) => {
  if (status === EvaluationResultStatus.ForReview) {
    return "text-primary-500"
  }
  if (status === EvaluationResultStatus.Draft) {
    return "text-gray-500"
  }
  if (status === EvaluationResultStatus.Ready) {
    return "text-green-500"
  }
}
