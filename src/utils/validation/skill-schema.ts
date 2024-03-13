import { boolean, object, string } from "yup"

export const createSkillSchema = object().shape({
  name: string().required("Name is required").max(255, "Name should not exceed 255 characters."),
  description: string().nullable(),
  skill_category_id: string().required("Skill category is required"),
  status: boolean().required(),
})
