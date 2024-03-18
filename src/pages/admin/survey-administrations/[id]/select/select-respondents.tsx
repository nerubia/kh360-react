import { SelectRespondentsHeader } from "@features/admin/survey-administrations/[id]/select/select-respondents-header"
import { SelectRespondentsFilter } from "@features/admin/survey-administrations/[id]/select/select-respondents-filter"
import { SelectRespondentsTable } from "@features/admin/survey-administrations/[id]/select/select-respondents-table"
import { SelectRespondentsFooter } from "@features/admin/survey-administrations/[id]/select/select-respondents-footer"
import { useTitle } from "@hooks/useTitle"

export default function SelectEvaluees() {
  useTitle("Select Survey Respondents")

  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <SelectRespondentsHeader />
      <SelectRespondentsFilter />
      <SelectRespondentsTable />
      <SelectRespondentsFooter />
    </div>
  )
}
