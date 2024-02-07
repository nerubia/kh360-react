import { number, object, string } from "yup"

export const createProjectMemberSchema = object().shape({
  project_id: string().required("Project is required"),
  user_id: string().required("Employee is required"),
  project_role_id: string().required("Role is required"),
  start_date: string()
    .required("Start date is required")
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
    .test("end-date", "End date must not be earlier than start date.", function (end_date) {
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
  allocation_rate: number()
    .typeError("Allocation rate must be a number")
    .required("Allocation rate is required")
    .test("is-valid-allocation-rate", "Allocation rate must be between 0 and 100", (value) => {
      return !isNaN(value) && value >= 0 && value <= 100
    }),
})
