import { useEffect } from "react"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { getEvaluationAdministrationsAsEvaluee } from "../../redux/slices/user-slice"
import { useAppSelector } from "../../hooks/useAppSelector"
import { Loading } from "../../types/loadingType"
import { Link } from "react-router-dom"
import { formatDateRange } from "../../utils/format-date"
import { Spinner } from "../../components/ui/spinner/spinner"
import { getByTemplateType } from "../../redux/slices/email-template-slice"
import { ScoreRange } from "../../components/shared/score-range/score-range"
import useMobileView from "../../hooks/use-mobile-view"

export const MyEvaluationsList = () => {
  const appDispatch = useAppDispatch()
  const isMobile = useMobileView()
  const { user } = useAppSelector((state) => state.auth)
  const { loading, my_evaluation_administrations, hasNextPage, currentPage } = useAppSelector(
    (state) => state.user
  )
  const { emailTemplate } = useAppSelector((state) => state.emailTemplate)

  useEffect(() => {
    void appDispatch(getEvaluationAdministrationsAsEvaluee({}))
    void appDispatch(getByTemplateType("No Available Evaluation Results"))
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
      {loading === Loading.Fulfilled && my_evaluation_administrations.length === 0 && (
        <p className='whitespace-pre-wrap'>{emailTemplate?.content}</p>
      )}
      {my_evaluation_administrations.map((evaluationAdministration) => (
        <Link
          key={evaluationAdministration.id}
          to={`/my-evaluations/${evaluationAdministration.id}`}
        >
          <div className='flex flex-col gap-4 shadow-md rounded-md p-4 hover:bg-slate-100'>
            <div className='flex flex-col items-center gap-5'>
              <div className='w-[280px] md:w-[700px]'>
                <ScoreRange
                  user_picture={user?.picture}
                  score_rating={evaluationAdministration.score_rating}
                  score={evaluationAdministration?.score}
                  size={isMobile ? "extraSmall" : "small"}
                  is_evaluee={true}
                  showDetails={false}
                />
              </div>
              <div className='text-center'>
                <h2 className='text-primary-500 sm:text-sm md:text-lg font-semibold'>
                  {evaluationAdministration.name}
                </h2>
                <p className='text-sm md:text-lg font-semibold md:font-normal'>
                  Evaluation Period:{" "}
                  {formatDateRange(
                    evaluationAdministration.eval_period_start_date,
                    evaluationAdministration.eval_period_end_date
                  )}
                </p>
                <p className='text-sm md:text-lg'>{evaluationAdministration.remarks}</p>
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
