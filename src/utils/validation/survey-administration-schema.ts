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

export const createSurveyAdministrationSchema = object().shape({
  name: string().required("Name is required").max(100, "Name must be at most 100 characters"),
  survey_start_date: string()
    .required("Start date is required")
    .transform(toDateOrUndefined)
    .test("start-date", "Start period must be before end period", function (start_date) {
      const end_date = this.parent.survey_end_date
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
  survey_end_date: string()
    .required("End date is required")
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
  survey_template_id: string().required("Survey Template is required"),
  email_subject: string().required("Email subject is required"),
  email_content: string().required("Email content is required"),
})
