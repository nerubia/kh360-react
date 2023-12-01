import { useEffect } from "react"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { getEvaluationAdministrationsAsEvaluee } from "../../redux/slices/user-slice"
import { useAppSelector } from "../../hooks/useAppSelector"
import { Loading } from "../../types/loadingType"
import { Link } from "react-router-dom"
import { formatDateRange } from "../../utils/format-date"
import { Spinner } from "../../components/ui/spinner/spinner"
import { Banding } from "../../components/shared/banding/banding"

export const MyEvaluationsList = () => {
  const appDispatch = useAppDispatch()
  const { loading, my_evaluation_administrations, hasNextPage, currentPage } = useAppSelector(
    (state) => state.user
  )

  useEffect(() => {
    void appDispatch(getEvaluationAdministrationsAsEvaluee({}))
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loading])

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading === Loading.Pending ||
      !hasNextPage
    ) {
      return
    }
    const newPage = currentPage + 1
    void appDispatch(
      getEvaluationAdministrationsAsEvaluee({
        page: newPage.toString(),
      })
    )
  }

  return (
    <div className='flex flex-col gap-8'>
      {my_evaluation_administrations.map((evaluationAdministration) => (
        <Link
          key={evaluationAdministration.id}
          to={`/my-evaluations/${evaluationAdministration.id}`}
        >
          <div className='flex flex-col items-start gap-4 md:flex-row md:justify-between shadow-md rounded-md p-4 hover:bg-slate-100'>
            <div className='flex flex-col gap-2'>
              <h2 className='text-primary-500 text-lg font-semibold'>
                {evaluationAdministration.name}
              </h2>
              <Banding banding={evaluationAdministration.banding ?? ""} />
              <p>Banding: {evaluationAdministration.banding}</p>
              <div>
                <p>
                  Evaluation Period:{" "}
                  {formatDateRange(
                    evaluationAdministration.eval_period_start_date,
                    evaluationAdministration.eval_period_end_date
                  )}
                </p>
                <p>{evaluationAdministration.remarks}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
      {loading === Loading.Pending && (
        <div className='text-center'>
          <Spinner />
        </div>
      )}
    </div>
  )
}
