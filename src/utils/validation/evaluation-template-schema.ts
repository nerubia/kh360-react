import { boolean, number, object, string } from "yup"

export const createEvaluationTemplateSchema = object().shape({
  name: string().required("Name is required"),
  display_name: string().required("Display name is required"),
  template_type: string().required("Template type is required"),
  template_class: string().required("Template class is required"),
  with_recommendation: boolean(),
  evaluator_role_id: number().required("Evaluator role is required"),
  evaluee_role_id: number().required("Evaluee role is required"),
  rate: number()
    .typeError("Rate must be a number")
    .required("Rate is required")
    .test("is-valid-rate", "Rate must be between 0 and 100", (value) => {
      return !isNaN(value) && value >= 0 && value <= 100
    }),
  answer_id: number().required("Answer is required"),
})
