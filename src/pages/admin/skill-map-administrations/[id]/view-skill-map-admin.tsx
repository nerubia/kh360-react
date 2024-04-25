import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import {
  getSkillMapAdmin,
  getSkillMapAdminSocket,
} from "@redux/slices/skill-map-administration-slice"
import { Loading } from "@custom-types/loadingType"
import { ViewSkillMapAdminHeader } from "@features/admin/skill-map-administrations/[id]/view-skill-map-admin-header"
import { ViewSkillMapAdminList } from "@features/admin/skill-map-administrations/[id]/view-skill-map-admin-list"
import { ViewSkillMapAdminFooter } from "@features/admin/skill-map-administrations/[id]/view-skill-map-admin-footer"
import { useTitle } from "@hooks/useTitle"
import { WebSocketContext, type WebSocketType } from "@components/providers/websocket"
import { Spinner } from "@components/ui/spinner/spinner"

export default function ViewSkillMapAdministration() {
  useTitle("View Skill Map Administration")

  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.skillMapAdministration)
  const { loading: loading_skill_map_results, skill_map_results } = useAppSelector(
    (state) => state.skillMapResults
  )
  const { lastJsonMessage } = useContext(WebSocketContext) as WebSocketType

  // Sample hard-coded data for now...
  const skill_map_administration = {
    id: 1,
    name: "This is a sample skill map admin",
    status: "Ongoing",
    remarks: "This is a sample description",
    skill_map_period_start_date: "2024-04-06",
    skill_map_period_end_date: "2023-03-14",
    skill_map_schedule_start_date: "2023-03-15",
    skill_map_schedule_end_date: "2023-03-16",
  }

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getSkillMapAdmin(parseInt(id)))
    }
  }, [id])

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getSkillMapAdminSocket(parseInt(id)))
    }
  }, [lastJsonMessage])

  return (
    <div className='flex flex-col gap-2'>
      {loading === Loading.Pending && skill_map_administration === null && <div>Loading...</div>}
      {loading === Loading.Fulfilled && skill_map_administration === null && <div>Not found</div>}
      <div className='h-[calc(100vh_-_104px)] flex flex-col gap-2' id='scroll-container'>
        {skill_map_administration !== null && (
          <>
            <ViewSkillMapAdminHeader />
            {loading_skill_map_results === Loading.Pending && <Spinner />}
            {loading_skill_map_results === Loading.Fulfilled && skill_map_results === null && (
              <div>Not found</div>
            )}
            {skill_map_results !== null && <ViewSkillMapAdminList />}
          </>
        )}
        <ViewSkillMapAdminFooter />
      </div>
    </div>
  )
}
