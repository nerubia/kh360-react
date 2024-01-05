import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useAppSelector } from "../../hooks/useAppSelector"
import { getUserEvaluationAdministrations } from "../../redux/slices/user-slice"
import { Progress } from "../../components/ui/progress/progress"
import { convertToFullDate, formatDateRange } from "../../utils/format-date"
import { Loading } from "../../types/loadingType"
import { Spinner } from "../../components/ui/spinner/spinner"
import { getByTemplateType } from "../../redux/slices/email-template-slice"
import useWebSocket from "react-use-websocket"

export const UserEvaluationAdministrationsTable = () => {
  const appDispatch = useAppDispatch()
  const { loading, user_evaluation_administrations, hasNextPage, currentPage } = useAppSelector(
    (state) => state.user
  )
  const { emailTemplate } = useAppSelector((state) => state.emailTemplate)
  const { lastJsonMessage } = useWebSocket(process.env.REACT_APP_WEBSOCKET_URL ?? "", {
    share: false,
    shouldReconnect: () => true,
  })

  useEffect(() => {
    void appDispatch(getUserEvaluationAdministrations({}))
    void appDispatch(getByTemplateType("No Pending Evaluation Forms"))
  }, [lastJsonMessage])

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

  return (
    <div className='flex flex-col gap-8'>
      {loading === Loading.Pending && (
        <div className='text-center'>
          <Spinner />
        </div>
      )}
      {loading === Loading.Fulfilled && user_evaluation_administrations?.length === 0 && (
        <p className='whitespace-pre-wrap'>{emailTemplate?.content}</p>
      )}
      {loading === Loading.Fulfilled && user_evaluation_administrations !== null && (
        <>
          {user_evaluation_administrations.map((evaluationAdministration) => (
            <Link
              key={evaluationAdministration.id}
              to={`/evaluation-administrations/${evaluationAdministration.id}/evaluations/all`}
            >
              <div className='flex flex-col items-start gap-4 md:flex-row md:justify-between shadow-md rounded-md p-4 hover:bg-slate-100'>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-primary-500 text-lg font-semibold'>
                    {evaluationAdministration.name}
                  </h2>
                  <Progress
                    value={
                      ((evaluationAdministration.totalSubmitted ?? 0) /
                        (evaluationAdministration.totalPending ?? 0)) *
                      100
                    }
                    width='w-96'
                  />
                  <p className='text-primary-500 text-sm font-semibold pt-2'>
                    {evaluationAdministration.totalSubmitted} out of{" "}
                    {evaluationAdministration.totalPending} Evaluations Submitted
                  </p>
                  <p>
                    Evaluate By:{" "}
                    {convertToFullDate(evaluationAdministration.eval_schedule_end_date)}
                  </p>
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
        </>
      )}
    </div>
  )
}
