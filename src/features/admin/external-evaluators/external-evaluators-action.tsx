import { useNavigate } from "react-router-dom"
import { Button } from "@components/ui/button/button"
import { useAppSelector } from "@hooks/useAppSelector"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { setExternalUser } from "@redux/slices/external-user-slice"

export const ExternalEvaluatorsAction = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { totalItems } = useAppSelector((state) => state.externalUsers)

  const handleAdd = () => {
    appDispatch(setExternalUser(null))
    navigate("/admin/external-evaluators/create")
  }

  return (
    <div className='flex flex-col items-center md:flex-row justify-between gap-4'>
      <h2 className='text-gray-400'>
        {totalItems} {totalItems === 1 ? "Result" : "Results"} Found
      </h2>
      <Button onClick={handleAdd}>Add External Evaluator</Button>
    </div>
  )
}
