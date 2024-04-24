import { PageTitle } from "@components/shared/page-title"
import { Badge } from "@components/ui/badge/badge"
import { getSurveyResultStatusVariant } from "@utils/variant"

export const SkillMapFormHeader = () => {
  const user_skill_map_admin = {
    id: 1,
    name: "This is a sample skill map admin",
    status: "Ongoing",
    remarks: "This is a sample description",
  }

  return (
    <>
      <div className='flex flex-col justify-between gap-4'>
        <div className='flex gap-4'>
          <div className='flex gap-4 items-center'>
            <PageTitle>{user_skill_map_admin?.name}</PageTitle>
            <Badge
              size={"medium"}
              variant={getSurveyResultStatusVariant(user_skill_map_admin.status ?? "")}
            >
              <div className='uppercase'>{user_skill_map_admin.status}</div>
            </Badge>
          </div>
        </div>
        <div>{user_skill_map_admin?.remarks}</div>
      </div>
    </>
  )
}
