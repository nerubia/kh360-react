import { object, string } from "yup"

export const createOtherSkillSchema = object().shape({
  other_skill_name: string()
    .required("Name is required")
    .max(255, "Name should not exceed 255 characters."),
})
