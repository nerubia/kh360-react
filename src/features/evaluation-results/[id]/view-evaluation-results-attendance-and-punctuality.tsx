import { useAppSelector } from "../../../hooks/useAppSelector"
import { Loading } from "../../../types/loadingType"

export const ViewEvaluationResultsAttendanceAndPunctuality = () => {
  const { loading, evaluation_result } = useAppSelector((state) => state.evaluationResult)

  return (
    <>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled && (
        <div>
          <div className='text-xl font-bold mb-2 text-primary-500'>Attendance and Punctuality</div>
          <table className='w-full table-fixed'>
            <thead className='text-left'>
              <tr className='text-center'>
                <th className='pb-3 text-start'>Month</th>
                <th className='pb-3'># Working Days</th>
                <th className='pb-3'>
                  # of Days
                  <br />
                  Present
                </th>
                <th className='pb-3'>
                  # of Lates
                  <br />
                  (GC)
                </th>
                <th className='pb-3'>
                  # of Lates
                  <br />
                  (Counted)
                </th>
                <th className='pb-3'>
                  # of
                  <br />
                  VL/BL
                </th>
                <th className='pb-3'>
                  # of
                  <br />
                  SL
                </th>
                <th className='pb-3'>
                  # of
                  <br />
                  EL
                </th>
                <th className='pb-3'>
                  # of Other
                  <br />
                  Leaves
                </th>
                <th className='pb-3'>
                  # of Unpaid
                  <br />
                  Leaves
                </th>
                <th className='pb-3'>
                  # of Unfiled
                  <br />
                  Leaves
                </th>
              </tr>
            </thead>
            <tbody>
              {evaluation_result?.attendance_and_punctuality?.map((data, index) => (
                <tr className='text-center cursor-pointer hover:bg-slate-100' key={index}>
                  <td className='py-1 text-start'>{data.month}</td>
                  <td className='py-1'>{data.total_working_days}</td>
                  <td className='py-1'>{data.days_present}</td>
                  <td
                    className={`py-1 ${
                      data.lates_grace_period !== undefined && data.lates_grace_period > 0
                        ? "text-red-500"
                        : ""
                    }`}
                  >
                    {data.lates_grace_period}
                  </td>
                  <td
                    className={`py-1 ${
                      data.lates !== undefined && data.lates > 0 ? "text-red-500" : ""
                    }`}
                  >
                    {data.lates}
                  </td>
                  <td className='py-1'>{data.vacation_and_birthday_leave_duration}</td>
                  <td className='py-1'>{data.sick_leave_duration}</td>
                  <td className='py-1'>{data.emergency_leave_duration}</td>
                  <td className='py-1'>{data.other_leave_duration}</td>
                  <td className='py-1'>{data.unpaid_leave_duration}</td>
                  <td className='py-1'>{data.unfiled_leave_duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
