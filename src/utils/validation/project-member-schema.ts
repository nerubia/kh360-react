import { object, string, number, date } from "yup"

const toDateOrUndefined = (
  value: Date | undefined,
  originalValue: string | undefined
): Date | undefined => {
  if (originalValue === "") {
    return undefined
  }
  return value
}

export const createProjectMemberSchema = object().shape({
  project_id: string().required("Project is required"),
  user_id: string().required("Employee is required"),
  project_role_id: string().required("Role is required"),
  start_date: date()
    .required("Start date is required")
    .transform(toDateOrUndefined)
    .test({
      name: "start-date",
      message: "Start date must not be later than end date.",
      test: function (start_date) {
        const end_date = this.parent.end_date
        return new Date(start_date) <= new Date(end_date)
      },
    })
    .test({
      name: "within-valid-range",
      message: "Must select a date that is within the valid range.",
      test: function (start_date) {
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

        return new Date(start_date) <= maxDate && new Date(minDate) <= new Date(start_date)
      },
    }),
  end_date: date()
    .required("End date is required")
    .transform(toDateOrUndefined)
    .test({
      name: "end-date",
      message: "End date must not be earlier than start date.",
      test: function (end_date) {
        const start_date = this.parent.start_date
        return new Date(end_date) >= new Date(start_date)
      },
    })
    .test({
      name: "within-valid-range",
      message: "Must select a date that is within the valid range.",
      test: function (end_date) {
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

        return new Date(end_date) <= maxDate && new Date(minDate) <= new Date(end_date)
      },
    }),
  allocation_rate: number()
    .typeError("Allocation rate must be a number")
    .required("Allocation rate is required")
    .test({
      name: "is-valid-allocation-rate",
      message: "Allocation rate must be between 0 and 100",
      test: (value) => {
        return !isNaN(value) && value >= 0 && value <= 100
      },
    }),
})
