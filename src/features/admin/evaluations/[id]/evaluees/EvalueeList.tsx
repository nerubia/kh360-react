import { useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { useAppDispatch } from "../../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../../hooks/useAppSelector"
import { getEvaluees } from "../../../../../redux/slices/evalueesSlice"

export const EvalueeList = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()

  const appDispatch = useAppDispatch()
  const { evaluation_results } = useAppSelector((state) => state.evaluees)

  useEffect(() => {
    void appDispatch(
      getEvaluees({
        evaluation_administration_id: id,
        name: searchParams.get("name") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  return (
    <div className='flex-1 flex flex-col gap-8 overflow-y-scroll'>
      <div className='flex flex-col gap-4 rounded-md'>
        {evaluation_results?.map((evaluationResult) => (
          <div
            key={evaluationResult.id}
            className='flex items-center gap-4 p-4 border rounded-md'
          >
            <img
              className='w-10 h-10 rounded-full'
              src={evaluationResult.users?.picture}
              alt={`Avatar of ${evaluationResult.users?.first_name} {evaluationResult.users?.first_name}`}
            />
            <div className='flex-1'>
              <p className='text-lg font-bold'>
                {evaluationResult.users?.last_name},{" "}
                {evaluationResult.users?.first_name}
              </p>
            </div>
            <div>{evaluationResult.status}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
