import { PageTitle } from "../../../../../components/shared/page-title"

export const EditEvaluationTemplateHeader = () => {
  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-col justify-between items-start md:items-end mt-2 md:flex-row gap-5'>
          <div>
            <div className='flex gap-4 primary-outline items-end mb-4'>
              <PageTitle>Edit Evaluation Template</PageTitle>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
