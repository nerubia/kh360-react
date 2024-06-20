import { type AnswerOption } from "@custom-types/answer-option-type"
import { type SkillCategory } from "@custom-types/skill-category-type"
import { type Skill } from "@custom-types/skill-type"

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

export const sortSkillCategoriesBySequenceNumber = (
  skillCategories: SkillCategory[],
  direction: "asc" | "desc" = "asc"
) => {
  return skillCategories.sort((a, b) => {
    const nameA = a.sequence_no ?? 0
    const nameB = b.sequence_no ?? 0
    if (nameA < nameB) return direction === "asc" ? -1 : 1
    if (nameA > nameB) return direction === "asc" ? 1 : -1
    return 0
  })
}

export const sortSkillsByName = (skills: Skill[], direction: "asc" | "desc" = "asc") => {
  return skills.sort((a, b) => {
    const nameA = a.name.toUpperCase()
    const nameB = b.name.toUpperCase()
    if (nameA < nameB) return direction === "asc" ? -1 : 1
    if (nameA > nameB) return direction === "asc" ? 1 : -1
    return 0
  })
}
