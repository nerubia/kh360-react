import { useAppSelector } from "@hooks/useAppSelector"
import { useState } from "react"
import { Loading } from "@custom-types/loadingType"
import { Button } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"

export const ViewEvaluationResultsAttendanceAndPunctuality = () => {
  const { loading, evaluation_result } = useAppSelector((state) => state.evaluationResult)
  const [showTable, setShowTable] = useState<boolean>(false)

  const toggleTable = () => {
    setShowTable((prev) => !prev)
  }

  return (
    <>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled && (
        <div>
          <Button variant='unstyled' onClick={toggleTable}>
            <div className='flex gap-2 text-base md:text-xl font-bold mb-2 text-primary-500'>
              Attendance and Punctuality
              {showTable ? <Icon icon='ChevronDown' /> : <Icon icon='ChevronUp' />}{" "}
            </div>
          </Button>
          {showTable && (
            <div className='overflow-x-auto'>
              <table className='w-full table-fixed whitespace-nowrap'>
                <thead className='text-left'>
                  <tr className='text-center'>
                    <th className='border-b-4 px-4 w-[100px] text-start'>Month</th>
                    <th className='border-b-4 px-4 w-[125px]'># Working Days</th>
                    <th className='border-b-4 p-6 w-[100px]'>
                      # of Days
                      <br />
                      Present
                    </th>
                    <th className='border-b-4 px-4 w-[100px]'>
                      # of Lates
                      <br />
                      (GC)
                    </th>
                    <th className='border-b-4 px-4 w-[100px]'>
                      # of Lates
                      <br />
                      (Counted)
                    </th>
                    <th className='border-b-4 px-4 w-[100px]'>
                      # of
                      <br />
                      VL/BL
                    </th>
                    <th className='border-b-4 px-4 w-[100px]'>
                      # of
                      <br />
                      SL
                    </th>
                    <th className='border-b-4 px-4 w-[100px]'>
                      # of
                      <br />
                      EL
                    </th>
                    <th className='border-b-4 px-4 w-[100px]'>
                      # of Other
                      <br />
                      Leaves
                    </th>
                    <th className='border-b-4 px-4 w-[100px]'>
                      # of Unpaid
                      <br />
                      Leaves
                    </th>
                    <th className='border-b-4 px-4 w-[100px]'>
                      # of Unfiled
                      <br />
                      Leaves
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {evaluation_result?.attendance_and_punctuality?.map((data, index) => (
                    <tr className='text-center hover:bg-slate-100' key={index}>
                      <td className='py-1 text-start border-b'>{data.month}</td>
                      <td className='py-1 border-b'>{data.total_working_days}</td>
                      <td className='py-1 border-b'>{data.days_present}</td>
                      <td
                        className={`py-1 border-b ${
                          data.lates_grace_period !== undefined && data.lates_grace_period > 0
                            ? "text-red-500"
                            : ""
                        }`}
                      >
                        {data.lates_grace_period}
                      </td>
                      <td
                        className={`py-1 border-b ${
                          data.lates !== undefined && data.lates > 0 ? "text-red-500" : ""
                        }`}
                      >
                        {data.lates}
                      </td>
                      <td className='py-1 border-b'>{data.vacation_and_birthday_leave_duration}</td>
                      <td className='py-1 border-b'>{data.sick_leave_duration}</td>
                      <td className='py-1 border-b'>{data.emergency_leave_duration}</td>
                      <td className='py-1 border-b'>{data.other_leave_duration}</td>
                      <td className='py-1 border-b'>{data.unpaid_leave_duration}</td>
                      <td className='py-1 border-b'>{data.unfiled_leave_duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  )
}
