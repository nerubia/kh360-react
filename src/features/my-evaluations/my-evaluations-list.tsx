import { useEffect } from "react"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { getEvaluationAdministrationsAsEvaluee } from "../../redux/slices/user-slice"
import { useAppSelector } from "../../hooks/useAppSelector"
import { Loading } from "../../types/loadingType"
import { Link } from "react-router-dom"
import { formatDateRange } from "../../utils/format-date"
import { Spinner } from "../../components/ui/spinner/spinner"

import veryLow from "../../assets/very-low.png"
import low from "../../assets/low.png"
import moderateLow from "../../assets/moderate-low.png"
import average from "../../assets/average.png"
import moderateHigh from "../../assets/moderate-high.png"
import high from "../../assets/high.png"
import veryHigh from "../../assets/very-high.png"

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
        <Link key={evaluationAdministration.id} to={`#`}>
          <div className='flex flex-col items-start gap-4 md:flex-row md:justify-between shadow-md rounded-md p-4 hover:bg-slate-100'>
            <div className='flex flex-col gap-2'>
              <h2 className='text-primary-500 text-lg font-semibold'>
                {evaluationAdministration.name}
              </h2>
              <div className='flex gap-4'>
                <div
                  className={`${
                    evaluationAdministration.banding === "Very Low" ? "bg-red-500 " : "bg-gray-200"
                  } rounded-full p-1`}
                >
                  <img className='w-10 h-10' src={veryLow} alt='' />
                </div>
                <div
                  className={`${
                    evaluationAdministration.banding === "Low" ? "bg-orange-500 " : "bg-gray-200"
                  } w-fit rounded-full p-1`}
                >
                  <img className='w-10 h-10' src={low} alt='' />
                </div>
                <div
                  className={`${
                    evaluationAdministration.banding === "Moderate Low"
                      ? "bg-yellow-500 "
                      : "bg-gray-200"
                  } w-fit rounded-full p-1`}
                >
                  <img className='w-10 h-10' src={moderateLow} alt='' />
                </div>
                <div
                  className={`${
                    evaluationAdministration.banding === "Average" ? "bg-green-500 " : "bg-gray-200"
                  } w-fit rounded-full p-1`}
                >
                  <img className='w-10 h-10' src={average} alt='' />
                </div>
                <div
                  className={`${
                    evaluationAdministration.banding === "Moderate High"
                      ? "bg-blue-500 "
                      : "bg-gray-200"
                  } w-fit rounded-full p-1`}
                >
                  <img className='w-10 h-10' src={moderateHigh} alt='' />
                </div>
                <div
                  className={`${
                    evaluationAdministration.banding === "High" ? "bg-indigo-500 " : "bg-gray-200"
                  } w-fit rounded-full p-1`}
                >
                  <img className='w-10 h-10' src={high} alt='' />
                </div>
                <div
                  className={`${
                    evaluationAdministration.banding === "Very High"
                      ? "bg-violet-500 "
                      : "bg-gray-200"
                  } w-fit rounded-full p-1`}
                >
                  <img className='w-10 h-10' src={veryHigh} alt='' />
                </div>
              </div>
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
