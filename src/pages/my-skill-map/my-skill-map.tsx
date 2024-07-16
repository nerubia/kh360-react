import { MySkillMapFilter } from "@features/my-skill-map/my-skill-map-filter"
import { MySkillMapHeader } from "@features/my-skill-map/my-skill-map-header"
import { MySkillMapLineGraph } from "@features/my-skill-map/my-skill-map-line-graph"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { useTitle } from "@hooks/useTitle"
import { getAnswerOptionsByType } from "@redux/slices/answer-options-slice"
import { getByTemplateType } from "@redux/slices/email-template-slice"
import { getMySkillMapRatings } from "@redux/slices/user-slice"
import { useEffect } from "react"

export default function MySkillMap() {
  useTitle("My Skill Map")

  const appDispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { my_skill_map } = useAppSelector((state) => state.user)
  const { emailTemplate } = useAppSelector((state) => state.emailTemplate)

  useEffect(() => {
    void appDispatch(getByTemplateType("No Result for My Skill Map"))
  }, [])

  useEffect(() => {
    if (user !== null) {
      void appDispatch(getAnswerOptionsByType("Skill Map Scale"))
      void appDispatch(getMySkillMapRatings(user.id))
    }
  }, [user])

  return (
    <div className='flex flex-col gap-8'>
      <MySkillMapHeader />
      {my_skill_map.length > 0 ? (
        <>
          <MySkillMapFilter />
          <MySkillMapLineGraph />
        </>
      ) : (
        <p className='whitespace-pre-wrap'>{emailTemplate?.content}</p>
      )}
    </div>
  )
}
