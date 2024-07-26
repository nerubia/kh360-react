import { boolean, number, object, string } from "yup"

export const createEvaluationTemplateContentSchema = object().shape({
  name: string().trim().required("Name is required"),
  description: string().required("Description name is required"),
  category: string().required("Category is required"),
  rate: number()
    .typeError("Rate must be a number")
    .required("Rate is required")
    .test("is-valid-rate", "Rate must be between 0 and 100", (value) => {
      return !isNaN(value) && value >= 0 && value <= 100
    }),
  is_active: boolean(),
})
