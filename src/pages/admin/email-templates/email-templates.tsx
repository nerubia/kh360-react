import { useTitle } from "@hooks/useTitle"
import { EmailTemplatesHeader } from "@features/admin/email-templates/email-templates-header"
import { EmailTemplatesTable } from "@features/admin/email-templates/email-templates-table"
import { EmailTemplatesFilter } from "@features/admin/email-templates/email-templates-filter"
import { EmailTemplatesAction } from "@features/admin/email-templates/email-templates-action"

export default function EmailTemplates() {
  useTitle("Message Templates")

  return (
    <div className='md:h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <EmailTemplatesHeader />
      <EmailTemplatesFilter />
      <EmailTemplatesAction />
      <EmailTemplatesTable />
    </div>
  )
}
