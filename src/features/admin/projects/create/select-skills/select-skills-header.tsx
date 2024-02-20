import { PageTitle } from "@components/shared/page-title"
import { useAppSelector } from "@hooks/useAppSelector"

export const SelectSkillsHeader = () => {
  const { projectFormData } = useAppSelector((state) => state.project)
  return (
    <div className='flex flex-col md:flex-row justify-between gap-4'>
      <PageTitle>
        Select Skills {projectFormData?.name !== undefined ? `for ${projectFormData?.name}` : ""}
      </PageTitle>
    </div>
  )
}
