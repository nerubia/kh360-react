import { DateRangeDisplay } from "@components/shared/display-range-date"
import { PageTitle } from "@components/shared/page-title"
import { Badge } from "@components/ui/badge/badge"
import { useMobileView } from "@hooks/use-mobile-view"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { getSkillMapAdmin } from "@redux/slices/skill-map-administration-slice"
import { getEvaluationAdministrationStatusVariant } from "@utils/variant"
import { useEffect } from "react"
import { useParams } from "react-router-dom"

export const SkillMapResultHeader = () => {
  const isMobile = useMobileView()
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { skill_map_administration } = useAppSelector((state) => state.skillMapAdministration)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getSkillMapAdmin(parseInt(id)))
    }
  }, [id])

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-col items-start justify-between gap-4 mt-2 md:items-end md:flex-row'>
          <div>
            <div className='flex items-end gap-4 mb-4 primary-outline'>
              <PageTitle>{skill_map_administration?.name}</PageTitle>
              <Badge
                size={isMobile ? "small" : "medium"}
                variant={getEvaluationAdministrationStatusVariant(skill_map_administration?.status)}
              >
                <div className='uppercase'>{skill_map_administration?.status}</div>
              </Badge>
            </div>
            <DateRangeDisplay
              label={`${isMobile ? "Map Period" : "Skill Map Period"}`}
              startDate={skill_map_administration?.skill_map_period_start_date}
              endDate={skill_map_administration?.skill_map_period_end_date}
              isMobile={isMobile}
            />
            <DateRangeDisplay
              label={`${isMobile ? "Map Schedule" : "Skill Map Schedule"}`}
              startDate={skill_map_administration?.skill_map_schedule_start_date}
              endDate={skill_map_administration?.skill_map_schedule_end_date}
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <pre className='font-sans break-words whitespace-pre-wrap'>
          {skill_map_administration?.remarks}
        </pre>
      </div>
      <h2 className='mt-5 mb-5 text-2xl font-bold'>Employees</h2>
    </>
  )
}
