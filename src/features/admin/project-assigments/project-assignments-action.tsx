import { LinkButton } from "../../../components/ui/button/button"
import { useAppSelector } from "../../../hooks/useAppSelector"

export const ProjectAssignmentsAction = () => {
  const { project_members } = useAppSelector((state) => state.projectMembers)
  return (
    <div className='flex flex-col items-center md:flex-row justify-between gap-4'>
      <h2 className='text-gray-400'>
        {project_members.length ?? "No"} {project_members.length === 1 ? "Result" : "Results"} Found
      </h2>
      <LinkButton to='/admin/project-assignments/create'>Create Assignment</LinkButton>
    </div>
  )
}
