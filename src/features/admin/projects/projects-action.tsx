import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { Button } from "../../../components/ui/button/button"

export const ProjectsAction = () => {
  const navigate = useNavigate()
  const { totalItems } = useAppSelector((state) => state.projects)

  const handleAdd = () => {
    navigate("/admin/projects/create")
  }

  return (
    <div className='flex flex-col items-center md:flex-row justify-between gap-4'>
      <h2 className='text-gray-400'>
        {totalItems} {totalItems === 1 ? "Result" : "Results"} Found
      </h2>
      <Button onClick={handleAdd}>Add Project</Button>
    </div>
  )
}
