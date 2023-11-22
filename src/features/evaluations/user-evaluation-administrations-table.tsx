import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useAppSelector } from "../../hooks/useAppSelector"
import { getUserEvaluationAdministrations } from "../../redux/slices/user-slice"
import { Button } from "../../components/button/Button"
import { Progress } from "../../components/ui/progress/progress"
import { convertToFullDate, formatDateRange } from "../../utils/format-date"
import { Loading } from "../../types/loadingType"
import { Spinner } from "../../components/spinner/Spinner"

export const UserEvaluationAdministrationsTable = () => {
  const navigate = useNavigate()

  const appDispatch = useAppDispatch()
  const { loading, user_evaluation_administrations, hasNextPage, currentPage } = useAppSelector(
    (state) => state.user
  )

  useEffect(() => {
    void appDispatch(getUserEvaluationAdministrations({}))
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
      getUserEvaluationAdministrations({
        page: newPage.toString(),
      })
    )
  }

  const handleViewEvaluation = (id: number) => {
    navigate(`/evaluation-administrations/${id}/evaluations/all`)
  }

  return (
    <div className='flex flex-col gap-8'>
      {user_evaluation_administrations.map((evaluationAdministration) => (
        <div
          key={evaluationAdministration.id}
          className='flex flex-col items-start gap-4 md:flex-row md:justify-between'
        >
          <div className='flex flex-col gap-2'>
            <Button
              variant='unstyled'
              onClick={() => handleViewEvaluation(evaluationAdministration.id)}
            >
              <h2 className='text-primary-500 text-lg font-semibold'>
                {evaluationAdministration.name}
              </h2>
            </Button>
            <Progress
              value={
                ((evaluationAdministration.totalSubmitted ?? 0) /
                  (evaluationAdministration.totalEvaluations ?? 0)) *
                100
              }
            />
            <p className='text-primary-500 text-sm font-semibold pt-2'>
              {evaluationAdministration.totalSubmitted} out of{" "}
              {evaluationAdministration.totalEvaluations} Evaluations Submitted
            </p>
            <p>Evaluate By: {convertToFullDate(evaluationAdministration.eval_schedule_end_date)}</p>
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
      ))}
      {loading === Loading.Pending && (
        <div className='text-center'>
          <Spinner />
        </div>
      )}
    </div>
  )
}
