import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { formatDateRange } from "@utils/format-date"
import { Spinner } from "@components/ui/spinner/spinner"
import { getByTemplateType, getByTemplateTypeSocket } from "@redux/slices/email-template-slice"
import { WebSocketContext, type WebSocketType } from "@components/providers/websocket"
import { Badge } from "@components/ui/badge/badge"
import { getSurveyResultStatusVariant } from "@utils/variant"
import { Loading } from "@custom-types/loadingType"
import { getUserSkillMapAdministrations } from "@redux/slices/user-slice"
import { setAlert } from "@redux/slices/app-slice"
import { SkillMapResultStatus } from "@custom-types/skill-map-result-type"

export const SkillMapFormsList = () => {
  const appDispatch = useAppDispatch()
  const { loading, user_skill_map_admins } = useAppSelector((state) => state.user)
  const { emailTemplate } = useAppSelector((state) => state.emailTemplate)
  const { lastJsonMessage } = useContext(WebSocketContext) as WebSocketType

  useEffect(() => {
    void appDispatch(getByTemplateType("No Pending Skill Map Forms"))
    void appDispatch(getUserSkillMapAdministrations())
  }, [])

  useEffect(() => {
    void appDispatch(getByTemplateTypeSocket("No Pending Skill Map Forms"))
  }, [lastJsonMessage])

  const handleNoResult = () => {
    appDispatch(
      setAlert({
        description: "This form has expired. Please contact admin for assistance.",
        variant: "destructive",
      })
    )
  }

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
            <div key={skillMap.id}>
              {skillMap.skill_map_result_status === SkillMapResultStatus.NoResult ? (
                <div
                  className='flex flex-col items-start gap-4 md:flex-row md:justify-between shadow-md rounded-md p-4 cursor-not-allowed'
                  onClick={handleNoResult}
                >
                  <div className='flex flex-col gap-2'>
                    <div className='flex gap-2 items-center'>
                      <h2 className='text-primary-500 text-lg font-semibold'>{skillMap.name}</h2>
                      <Badge
                        variant={getSurveyResultStatusVariant(skillMap.skill_map_result_status)}
                        size='small'
                      >
                        <div className='uppercase'>Expired</div>
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
              ) : (
                <Link to={`/skill-map-forms/${skillMap.id}`}>
                  <div className='flex flex-col items-start gap-4 md:flex-row md:justify-between shadow-md rounded-md p-4 hover:bg-slate-100'>
                    <div className='flex flex-col gap-2'>
                      <div className='flex gap-2 items-center'>
                        <h2 className='text-primary-500 text-lg font-semibold'>{skillMap.name}</h2>
                        <Badge
                          variant={getSurveyResultStatusVariant(skillMap.skill_map_result_status)}
                          size='small'
                        >
                          <div className='uppercase'>{skillMap.skill_map_result_status}</div>
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
              )}
            </div>
          ))}
        </>
      }
    </div>
  )
}
