import { object, string } from "yup"

const toDateOrUndefined = (
  value: Date | undefined,
  originalValue: string | undefined
): Date | undefined => {
  if (originalValue === "") {
    return undefined
  }
  return value
}

export const createEvaluationAdministrationSchema = object().shape({
  name: string().required("Name is required").max(100, "Name must be at most 100 characters"),
  eval_period_start_date: string()
    .required("Start period is required")
    .transform(toDateOrUndefined)
    .test("start-date", "Start period must be before end period", function (start_date) {
      const end_date = this.parent.eval_period_end_date
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
  eval_period_end_date: string()
    .required("End period is required")
    .transform(toDateOrUndefined)
    .test("end-date", "End period must not be later than start schedule", function (end_date) {
      const start_schedule = this.parent.eval_schedule_start_date
      return new Date(end_date) <= new Date(start_schedule)
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
  eval_schedule_start_date: string()
    .required("Start schedule is required")
    .transform(toDateOrUndefined)
    .test("start-date", "Start schedule must be before end schedule", function (start_date) {
      const end_date = this.parent.eval_schedule_end_date
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
    )
    .test(
      "not-in-eval-period",
      "Evaluation schedule must be later than Evaluation Period",
      function (start_date) {
        const evalPeriodEndDate = this.parent.eval_period_end_date
        return new Date(start_date) > new Date(evalPeriodEndDate)
      }
    ),
  eval_schedule_end_date: string()
    .required("End schedule is required")
    .transform(toDateOrUndefined)
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
  remarks: string().required("Description is required"),
  email_subject: string().required("Email subject is required"),
  email_content: string().required("Email content is required"),
})
