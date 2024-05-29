import { LineGraph } from "@components/ui/linegraph/linegraph"
import { useAppSelector } from "@hooks/useAppSelector"

export const MySkillMapLineGraph = () => {
  const { user } = useAppSelector((state) => state.auth)

  if (user == null) {
    return <div>No user</div>
  }

  return (
    <div>
      <LineGraph id={user.id} />
    </div>
  )
}
