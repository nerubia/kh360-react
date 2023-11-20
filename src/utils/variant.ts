import { EvaluationResultStatus } from "../types/evaluation-result-type"
import { EvaluationStatus } from "../types/evaluation-type"
import { EvaluationAdministrationStatus } from "../types/evaluationAdministrationType"

export const getEvaluationAdministrationStatusVariant = (status: string | undefined) => {
  if (status === EvaluationAdministrationStatus.Draft) {
    return "primary"
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
    return "yellow"
  }
  if (status === EvaluationResultStatus.Draft) {
    return "primary"
  }
  if (status === EvaluationResultStatus.Ready) {
    return "green"
  }
  if (status === EvaluationResultStatus.Ongoing) {
    return "blue"
  }
  if (status === EvaluationResultStatus.Completed) {
    return "pink"
  }
}

export const getEvaluationStatusVariant = (status: string | undefined) => {
  if (status === EvaluationStatus.Draft) {
    return "primary"
  }
  if (status === EvaluationStatus.Open) {
    return "yellow"
  }
  if (status === EvaluationStatus.Ongoing) {
    return "green"
  }
  if (status === EvaluationStatus.Submitted) {
    return "blue"
  }
  if (status === EvaluationStatus.Cancelled) {
    return "gray"
  }
  if (status === EvaluationStatus.Expired) {
    return "red"
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
