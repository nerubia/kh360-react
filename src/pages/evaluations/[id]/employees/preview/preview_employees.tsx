import { useParams } from "react-router-dom"
import { useAppDispatch } from "../../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../../hooks/useAppSelector"
import { useEffect } from "react"
import { getEvaluation } from "../../../../../redux/slices/evaluationsSlice"
import { PreviewEmployeesForm } from "../../../../../features/evaluations/view/PreviewEmployeesForm"

export default function PreviewEmployees() {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const { loading, evaluation } = useAppSelector((state) => state.evaluations)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getEvaluation(id))
    }
  }, [id])

  return (
    <div className='flex flex-col gap-4'>
      {loading && <div>Loading...</div>}
      {!loading && evaluation == null && <div>Not found</div>}
      {!loading && evaluation !== null && (
        <div className='flex flex-col'>
          <h1 className='text-lg font-bold'>{evaluation.name}</h1>
          <PreviewEmployeesForm />
        </div>
      )}
    </div>
  )
}
