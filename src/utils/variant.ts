import { EvaluationResultStatus } from "../types/evaluation-result-type"
import { EvaluationStatus } from "../types/evaluation-type"
import { EvaluationAdministrationStatus } from "../types/evaluation-administration-type"
import { AnswerType } from "../types/answer-option-type"

export const getEvaluationAdministrationStatusVariant = (status: string | undefined) => {
  if (status === EvaluationAdministrationStatus.Draft) {
    return "primary"
  }
  if (status === EvaluationAdministrationStatus.Pending) {
    return "yellow"
  }
  if (status === EvaluationAdministrationStatus.Processing) {
    return "orange"
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
  if (status === EvaluationStatus.ForRemoval) {
    return "orange"
  }
}

export const getAnswerOptionVariant = (
  sequenceNumber: number,
  evaluationRating: number,
  answerType: string
) => {
  if (answerType === AnswerType.NA) {
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

export const getProgressVariant = (value: number) => {
  if (value > 0 && value < 100) {
    return "green"
  } else {
    return "blue"
  }
}

export const getRoleVariant = (role: string | undefined) => {
  if (role === "Board of Directors") {
    return "#bac3ff"
  }
  if (role === "Human Resource") {
    return "#fff7cf"
  }
  if (role === "Project Manager") {
    return "#cfd0ff"
  }
  if (role === "System Analyst") {
    return "#fff8c5"
  }
  if (role === "Developer") {
    return "#c7e0ff"
  }
  if (role === "Quality Assurance") {
    return "#e4f0c8"
  }
  if (role === "Code Reviewer") {
    return "#fed3c9"
  }
}

export const getScoreRatingVariant = (score_rating: string) => {
  if (score_rating === "Needs Improvement") {
    return "red"
  }
  if (score_rating === "Fair") {
    return "orange"
  }
  if (score_rating === "Satisfactory") {
    return "yellow"
  }
  if (score_rating === "Good") {
    return "lightGreen"
  }
  if (score_rating === "Excellent") {
    return "green"
  }
}

export const getScoreVariant = (score: number) => {
  if (score >= 0 && score <= 19) {
    return "red"
  }
  if (score >= 20 && score <= 39) {
    return "orange"
  }
  if (score >= 40 && score <= 59) {
    return "yellow"
  }
  if (score >= 60 && score <= 79) {
    return "lightGreen"
  }
  if (score >= 80 && score <= 100) {
    return "green"
  }
}
