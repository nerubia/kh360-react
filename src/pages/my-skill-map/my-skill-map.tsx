import { MySkillMapHeader } from "@features/my-skill-map/my-skill-map-header"
import { MySkillMapLineGraph } from "@features/my-skill-map/my-skill-map-line-graph"
import { useTitle } from "@hooks/useTitle"

export default function MySkillMap() {
  useTitle("My Skill Map")

  return (
    <div className='flex flex-col gap-8'>
      <MySkillMapHeader />
      <MySkillMapLineGraph />
    </div>
  )
}
