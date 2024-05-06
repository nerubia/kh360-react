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
  const { loading, skill_map_administration } = useAppSelector(
    (state) => state.skillMapAdministration
  )
  const { loading: loading_skill_map_results, skill_map_results } = useAppSelector(
    (state) => state.skillMapResults
  )
  const { lastJsonMessage } = useContext(WebSocketContext) as WebSocketType

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
