import { number, object, string } from "yup"

export const createProjectMemberSchema = object().shape({
  project_id: string().required("Project is required"),
  user_id: string().required("Employee is required"),
  project_role_id: string().required("Role is required"),
  start_date: string().required("Start date is required"),
  end_date: string().required("End date is required"),
  allocation_rate: number()
    .typeError("Allocation rate must be a number")
    .required("Allocation rate is required")
    .test("is-valid-allocation-rate", "Allocation rate must be between 0 and 100", (value) => {
      return !isNaN(value) && value >= 0 && value <= 100
    }),
})
