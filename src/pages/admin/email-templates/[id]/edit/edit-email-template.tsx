import { useTitle } from "../../../../../hooks/useTitle"
import { EmailTemplateForm } from "../../../../../features/admin/email-templates/email-template-form/email-template-form"

export default function EditEmailTemplate() {
  useTitle("Edit Message Template")

  return (
    <div className='flex flex-col'>
      <EmailTemplateForm />
    </div>
  )
}
