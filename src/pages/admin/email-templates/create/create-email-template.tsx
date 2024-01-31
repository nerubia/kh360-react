import { EmailTemplateForm } from "@features/admin/email-templates/email-template-form/email-template-form"
import { EmailTemplateHeader } from "@features/admin/email-templates/email-template-form/email-templates-header"
import { useTitle } from "@hooks/useTitle"

export default function CreateEmailTemplate() {
  useTitle("Add Message Template")

  return (
    <div className='flex flex-col gap-5'>
      <EmailTemplateHeader title='Add Message Template' />
      <EmailTemplateForm />
    </div>
  )
}
