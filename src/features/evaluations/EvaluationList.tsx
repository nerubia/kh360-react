import { useEffect } from "react"
import moment from "moment"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useAppSelector } from "../../hooks/useAppSelector"
import { LinkButton } from "../../components/button/Button"
import { Input } from "../../components/input/Input"
import { getEvaluations } from "../../redux/slices/evaluationsSlice"

export const EvaluationList = () => {
  const appDispatch = useAppDispatch()
  const { evaluations } = useAppSelector((state) => state.evaluations)

  useEffect(() => {
    void appDispatch(getEvaluations())
  }, [])

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <Input name='search' placeholder='Search by name' onChange={() => {}} />
        <LinkButton to='/evaluations/create'>Create</LinkButton>
      </div>
      <table className='w-full table-fixed'>
        <thead className='text-left'>
          <tr>
            <th>Name</th>
            <th>Period</th>
            <th>Schedule</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((evaluation) => (
            <tr key={evaluation.id}>
              <td>{evaluation.name}</td>
              <td>
                {moment(evaluation.eval_period_start_date).format("MMM D YYYY")}{" "}
                - {moment(evaluation.eval_period_end_date).format("MMM D YYYY")}
              </td>
              <td>
                {moment(evaluation.eval_schedule_start_date).format(
                  "MMM D YYYY"
                )}{" "}
                -{" "}
                {moment(evaluation.eval_schedule_end_date).format("MMM D YYYY")}
              </td>
              <td>{evaluation.status}</td>
              <td>Actions</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
