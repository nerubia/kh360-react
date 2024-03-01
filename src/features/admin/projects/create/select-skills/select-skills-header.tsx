import { PageTitle } from "@components/shared/page-title"
import { useAppSelector } from "@hooks/useAppSelector"
import { useSearchParams } from "react-router-dom"

export const SelectSkillsHeader = () => {
  const { projectFormData } = useAppSelector((state) => state.project)
  const [searchParams] = useSearchParams()
  const project_name = searchParams.get("project_name")

  return (
    <div className='flex flex-col md:flex-row justify-between gap-4'>
      <PageTitle>
        Select Skills{" "}
        {project_name !== null || projectFormData?.name !== undefined
          ? `for ${project_name ?? projectFormData?.name}`
          : ""}
      </PageTitle>
    </div>
  )
}
