import { PageTitle } from "@components/shared/page-title"
import { Badge } from "@components/ui/badge/badge"
import { getSurveyResultStatusVariant } from "@utils/variant"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useEffect } from "react"
import { getUserSkillMapRatings } from "@redux/slices/user-slice"
import { useParams, useNavigate } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { SkillMapAdminStatus } from "@custom-types/skill-map-admin-type"

export const SkillMapFormHeader = () => {
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user_skill_map_admins, skill_map_result_status } = useAppSelector((state) => state.user)
  const { id } = useParams()

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getUserSkillMapRatings(parseInt(id)))
    }
  }, [])

  useEffect(() => {
    if (user_skill_map_admins[0] !== undefined) {
      if (user_skill_map_admins[0]?.status !== SkillMapAdminStatus.Ongoing) {
        handleRedirect()
      }
    }
  }, [user_skill_map_admins])

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
        <div>{user_skill_map_admins[0]?.remarks}</div>
      </div>
    </>
  )
}
