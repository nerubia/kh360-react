import { type AnswerOption } from "@custom-types/answer-option-type"

export const sortAnswerOptionBySequenceNumber = (
  answerOptions: AnswerOption[],
  direction: "asc" | "desc" = "asc"
) => {
  return answerOptions.sort((a, b) => {
    const answerOptionA = a.sequence_no
    const answerOptionB = b.sequence_no
    if (answerOptionA < answerOptionB) return direction === "asc" ? -1 : 1
    if (answerOptionA > answerOptionB) return direction === "asc" ? 1 : -1
    return 0
  })
}
