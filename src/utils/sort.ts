import { type AnswerOption } from "@custom-types/answer-option-type"
import { type MySkillMap } from "@custom-types/my-skill-map-type"
import { type SkillCategory } from "@custom-types/skill-category-type"
import { type Skill } from "@custom-types/skill-type"
import { type UserSkillMap } from "@custom-types/user-type"

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

export const sortUserSkillMapByPeriodEndDate = (user_skill_map: UserSkillMap[]) => {
  return user_skill_map
    .filter((s) => s.skill_map_results.length > 0 && s.skill_map_results[0].comments !== "")
    .sort((a, b) => {
      const dateA =
        a.skill_map_period_end_date != null ? new Date(a.skill_map_period_end_date) : new Date(0)
      const dateB =
        b.skill_map_period_end_date != null ? new Date(b.skill_map_period_end_date) : new Date(0)
      return dateB.getTime() - dateA.getTime()
    })
}

export const sortMySkillMapByPeriodEndDate = (my_skill_map: MySkillMap[]) => {
  return my_skill_map
    .filter(
      (skillMap) =>
        skillMap.skill_map_results.length > 0 && skillMap.skill_map_results[0].comments !== ""
    )
    .sort((a, b) => {
      const dateA =
        a.skill_map_period_end_date != null ? new Date(a.skill_map_period_end_date) : new Date(0)
      const dateB =
        b.skill_map_period_end_date != null ? new Date(b.skill_map_period_end_date) : new Date(0)
      return dateB.getTime() - dateA.getTime()
    })
}
