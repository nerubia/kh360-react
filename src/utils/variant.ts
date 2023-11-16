import { EvaluationResultStatus } from "../types/evaluation-result-type"
import { EvaluationStatus } from "../types/evaluationType"
import { EvaluationAdministrationStatus } from "../types/evaluationAdministrationType"

export const getEvaluationAdministrationStatusVariant = (status: string | undefined) => {
  if (status === EvaluationAdministrationStatus.Draft) {
    return "greenOutline"
  }
  if (status === EvaluationAdministrationStatus.Pending) {
    return "yellow"
  }
  if (status === EvaluationAdministrationStatus.Ongoing) {
    return "green"
  }
  if (status === EvaluationAdministrationStatus.Closed) {
    return "blue"
  }
  if (status === EvaluationAdministrationStatus.Cancelled) {
    return "gray"
  }
}
export const getEvaluationResultStatusVariant = (status: string | undefined) => {
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

export const getEvaluationStatusVariant = (status: string | undefined) => {
  if (status === EvaluationStatus.Open) {
    return "yellow"
  }
  if (status === EvaluationStatus.Ongoing) {
    return "green"
  }
  if (status === EvaluationStatus.Submitted) {
    return "blue"
  }
}

export const getAnswerOptionVariant = (sequenceNumber: number, evaluationRating: number) => {
  if (sequenceNumber === 1) {
    if (evaluationRating === 1) {
      return "NAOption"
    } else {
      return "NAOptionEmpty"
    }
  } else if (sequenceNumber <= (evaluationRating ?? 0)) {
    return "star"
  } else {
    return "starEmpty"
  }
}
