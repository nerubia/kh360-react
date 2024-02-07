import { object, string, array } from "yup"

export const createProjectSchema = object().shape({
  name: string().required("Name is required."),
  client_id: string(),
  start_date: string()
    .required("Start date is required.")
    .test("start-date", "Start date must not be later than end date.", function (start_date) {
      const end_date = this.parent.end_date
      return new Date(start_date) <= new Date(end_date)
    })
    .test(
      "start-date",
      "Must select a date that is within the valid range.",
      function (start_date) {
        const currentDate = new Date()

        const maxDate = new Date(
          currentDate.getFullYear() + 50,
          currentDate.getMonth(),
          currentDate.getDate()
        )

        const minDate = new Date(
          currentDate.getFullYear() - 50,
          currentDate.getMonth(),
          currentDate.getDate()
        )

        return (
          new Date(start_date) <= new Date(maxDate) && new Date(minDate) <= new Date(start_date)
        )
      }
    ),
  end_date: string()
    .required("End date is required")
    .test("end-date", "End period must not be earlier than start date.", function (end_date) {
      const start_date = this.parent.start_date
      return new Date(end_date) >= new Date(start_date)
    })
    .test("end-date", "Must select a date that is within the valid range.", function (end_date) {
      const currentDate = new Date()

      const maxDate = new Date(
        currentDate.getFullYear() + 50,
        currentDate.getMonth(),
        currentDate.getDate()
      )

      const minDate = new Date(
        currentDate.getFullYear() - 50,
        currentDate.getMonth(),
        currentDate.getDate()
      )

      return new Date(end_date) <= new Date(maxDate) && new Date(minDate) <= new Date(end_date)
    }),
  description: string().required("Description is required."),
  status: string().required("Status is required."),
  skill_ids: array(),
})
