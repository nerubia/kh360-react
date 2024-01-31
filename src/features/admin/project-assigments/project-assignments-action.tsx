import { Button } from "@components/ui/button/button"
import { useAppSelector } from "@hooks/useAppSelector"
import { setProjectMember } from "@redux/slices/project-member-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useNavigate } from "react-router"

export const ProjectAssignmentsAction = () => {
  const { project_members } = useAppSelector((state) => state.projectMembers)
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleCreate = () => {
    void appDispatch(setProjectMember(null))
    navigate("/admin/project-assignments/create")
  }
  return (
    <div className='flex flex-col items-center md:flex-row justify-between gap-4'>
      <h2 className='text-gray-400'>
        {project_members.length ?? "No"} {project_members.length === 1 ? "Result" : "Results"} Found
      </h2>
      <Button onClick={handleCreate}>Create Assignment</Button>
    </div>
  )
}
