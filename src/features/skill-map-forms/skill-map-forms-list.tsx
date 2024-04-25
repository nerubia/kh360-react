import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { formatDateRange } from "@utils/format-date"
import { Spinner } from "@components/ui/spinner/spinner"
import { getByTemplateType, getByTemplateTypeSocket } from "@redux/slices/email-template-slice"
import { WebSocketContext, type WebSocketType } from "@components/providers/websocket"
import { Badge } from "@components/ui/badge/badge"
import { getEvaluationAdministrationStatusVariant } from "@utils/variant"
import { Loading } from "@custom-types/loadingType"
import { getUserSkillMapAdministrations } from "@redux/slices/user-slice"

export const SkillMapFormsList = () => {
  const appDispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.user)
  const { emailTemplate } = useAppSelector((state) => state.emailTemplate)
  const { lastJsonMessage } = useContext(WebSocketContext) as WebSocketType

  // Sample hard-coded user skill map admins for now
  const user_skill_map_admins = [
    {
      id: 1,
      name: "This is a sample skill map admin",
      status: "Ongoing",
      remarks: "This is a sample description",
      skill_map_period_start_date: "2024-04-06T00:00:00.000Z",
      skill_map_period_end_date: "2023-03-14T00:00:00.000Z",
      skill_map_schedule_start_date: "2023-03-15T00:00:00.000Z",
      skill_map_schedule_end_date: "2023-03-16T00:00:00.000Z",
    },
  ]

  useEffect(() => {
    void appDispatch(getByTemplateType("No Pending Skill Map Forms"))
    void appDispatch(getUserSkillMapAdministrations())
  }, [])

  useEffect(() => {
    void appDispatch(getByTemplateTypeSocket("No Pending Skill Map Forms"))
  }, [lastJsonMessage])

  return (
    <div className='flex flex-col gap-8'>
      {loading === Loading.Pending && (
        <div className='text-center'>
          <Spinner />
        </div>
      )}
      {loading === Loading.Fulfilled && user_skill_map_admins?.length === 0 && (
        <p className='whitespace-pre-wrap'>{emailTemplate?.content}</p>
      )}
      {
        <>
          {user_skill_map_admins.map((skillMap) => (
            <Link key={skillMap.id} to={`/skill-map-forms/${skillMap.id}`}>
              <div className='flex flex-col items-start gap-4 md:flex-row md:justify-between shadow-md rounded-md p-4 hover:bg-slate-100'>
                <div className='flex flex-col gap-2'>
                  <div className='flex gap-2 items-center'>
                    <h2 className='text-primary-500 text-lg font-semibold'>{skillMap.name}</h2>
                    <Badge
                      variant={getEvaluationAdministrationStatusVariant(skillMap?.status)}
                      size='small'
                    >
                      <div className='uppercase'>{skillMap?.status}</div>
                    </Badge>
                  </div>
                  <div>
                    <p>
                      Period:{" "}
                      {formatDateRange(
                        skillMap.skill_map_period_start_date,
                        skillMap.skill_map_period_end_date
                      )}
                    </p>
                  </div>
                  <div>
                    <p>
                      Schedule:{" "}
                      {formatDateRange(
                        skillMap.skill_map_schedule_start_date,
                        skillMap.skill_map_schedule_end_date
                      )}
                    </p>
                  </div>
                  <p>{skillMap.remarks}</p>
                </div>
              </div>
            </Link>
          ))}
        </>
      }
    </div>
  )
}
