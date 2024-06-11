import { PageTitle } from "@components/shared/page-title"
import { Badge } from "@components/ui/badge/badge"
import { getSurveyResultStatusVariant } from "@utils/variant"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useEffect } from "react"
import { getUserSkillMapRatings } from "@redux/slices/user-slice"
import { useParams, useNavigate } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { SkillMapAdminStatus } from "@custom-types/skill-map-admin-type"
import { DateRangeDisplay } from "@components/shared/display-range-date"
import { useMobileView } from "@hooks/use-mobile-view"

export const SkillMapFormHeader = () => {
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()
  const isMobile = useMobileView()
  const { user_skill_map_admins, skill_map_result_status } = useAppSelector((state) => state.user)
  const { id } = useParams()

  useEffect(() => {
    void loadData()
  }, [])

  useEffect(() => {
    if (user_skill_map_admins[0] !== undefined) {
      if (user_skill_map_admins[0]?.status !== SkillMapAdminStatus.Ongoing) {
        handleRedirect()
      }
    }
  }, [user_skill_map_admins])

  const loadData = async () => {
    if (id !== undefined) {
      const result = await appDispatch(getUserSkillMapRatings(parseInt(id)))
      if (result.type === "user/getUserSkillMapRatings/rejected") {
        handleRedirect()
      }
    }
  }

  const handleRedirect = () => {
    navigate("/skill-map-forms")
  }

  return (
    <>
      <div className='flex flex-col justify-between gap-4'>
        <div className='flex gap-4'>
          <div className='flex gap-4 items-center'>
            <PageTitle>{user_skill_map_admins[0]?.name}</PageTitle>
            <Badge
              size={"medium"}
              variant={getSurveyResultStatusVariant(skill_map_result_status ?? "")}
            >
              <div className='uppercase'>{skill_map_result_status}</div>
            </Badge>
          </div>
        </div>
        <div>
          <DateRangeDisplay
            label='Skill Map Period'
            startDate={user_skill_map_admins[0]?.skill_map_period_start_date}
            endDate={user_skill_map_admins[0]?.skill_map_period_end_date}
            isMobile={isMobile}
          />
          <DateRangeDisplay
            label='Skill Map Schedule'
            startDate={user_skill_map_admins[0]?.skill_map_schedule_start_date}
            endDate={user_skill_map_admins[0]?.skill_map_schedule_end_date}
            isMobile={isMobile}
          />
        </div>
        <div>{user_skill_map_admins[0]?.remarks}</div>
      </div>
    </>
  )
}
