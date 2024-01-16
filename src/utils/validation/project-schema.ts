import { object, string, array } from "yup"

export const createProjectSchema = object().shape({
  name: string().required("Name is required."),
  client_id: string().required("Client is required."),
  start_date: string()
    .required("Start date is required.")
    .test("start-date", "Start date must not be later than end date.", function (start_date) {
      const end_date = this.parent.end_date
      return new Date(start_date) <= new Date(end_date)
    }),
  end_date: string()
    .required("End date is required")
    .test("end-date", "End period must not be earlier than start date.", function (end_date) {
      const start_date = this.parent.start_date
      return new Date(end_date) >= new Date(start_date)
    }),
  description: string().required("Description is required."),
  status: string().required("Status is required."),
  skill_ids: array(),
})
