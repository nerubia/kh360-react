import { SelectRespondentsHeader } from "@features/admin/survey-administrations/[id]/select/select-respondents-header"
import { SelectRespondentsFilter } from "@features/admin/survey-administrations/[id]/select/select-respondents-filter"
import { SelectRespondentsTable } from "@features/admin/survey-administrations/[id]/select/select-respondents-table"
import { SelectRespondentsFooter } from "@features/admin/survey-administrations/[id]/select/select-respondents-footer"
import SelectUser from "@components/shared/select-user/select-user"

export default function SelectEvaluees() {
  return (
    <SelectUser
      HeaderComponent={SelectRespondentsHeader}
      FilterComponent={SelectRespondentsFilter}
      TableComponent={SelectRespondentsTable}
      FooterComponent={SelectRespondentsFooter}
      title='Select Survey Respondents'
      className='h-[calc(100vh_-_104px)] flex flex-col gap-8'
    />
  )
}
