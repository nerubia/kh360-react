import { boolean, object, string } from "yup"

export const createSkillCategorySchema = object().shape({
  name: string().required("Name is required").max(255, "Name should not exceed 255 characters."),
  status: boolean().required(),
  description: string(),
})
