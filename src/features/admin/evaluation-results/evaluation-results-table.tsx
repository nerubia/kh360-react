import { useEffect } from "react"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { getBodEvaluationAdministrations } from "../../../redux/slices/evaluation-administrations-slice"
import { Loading } from "../../../types/loadingType"
import { Link } from "react-router-dom"
import { Spinner } from "../../../components/ui/spinner/spinner"
import { formatDateRange } from "../../../utils/format-date"
import { EvaluationAdministrationStatus } from "../../../types/evaluation-administration-type"

export const EvaluationResultsTable = () => {
  const appDispatch = useAppDispatch()

  const { loading, evaluation_administrations, hasNextPage, currentPage } = useAppSelector(
    (state) => state.evaluationAdministrations
  )

  useEffect(() => {
    void appDispatch(
      getBodEvaluationAdministrations({
        status: [
          EvaluationAdministrationStatus.Closed,
          EvaluationAdministrationStatus.Published,
        ].join(","),
      })
    )
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
      getBodEvaluationAdministrations({
        status: [
          EvaluationAdministrationStatus.Closed,
          EvaluationAdministrationStatus.Published,
        ].join(","),
        page: newPage.toString(),
      })
    )
  }

  return (
    <div className='flex flex-col gap-8'>
      <>
        {evaluation_administrations.map((evaluationAdministration) => (
          <Link
            key={evaluationAdministration.id}
            to={`/admin/evaluation-results/${evaluationAdministration.id}`}
          >
            <div className='flex flex-col items-start gap-4 md:flex-row md:justify-between shadow-md rounded-md p-4 hover:bg-slate-100'>
              <div className='flex flex-col gap-2'>
                <h2 className='text-primary-500 text-lg font-semibold'>
                  {evaluationAdministration.name}
                </h2>
                <p className='text-primary-500 text-sm font-semibold'>
                  {evaluationAdministration.evaluees_count} Evaluation Results
                </p>
                <p>
                  Evaluation Period:{" "}
                  {formatDateRange(
                    evaluationAdministration.eval_period_start_date,
                    evaluationAdministration.eval_period_end_date
                  )}
                </p>
                <p>Comments: {evaluationAdministration.remarks}</p>
              </div>
            </div>
          </Link>
        ))}
      </>
      {loading === Loading.Pending && (
        <div className='text-center'>
          <Spinner />
        </div>
      )}
    </div>
  )
}
