import { useParams } from "react-router-dom"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { Loading } from "../../../types/loadingType"
import { Banding } from "../../../components/shared/banding/banding"

export const MyEvaluationResultsTable = () => {
  const { id } = useParams()
  const { loading, user_evaluation_result } = useAppSelector((state) => state.user)

  return (
    <>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled && user_evaluation_result === null && <div>Not found</div>}
      <div>
        {loading === Loading.Fulfilled &&
          user_evaluation_result?.evaluation_result_details !== undefined &&
          user_evaluation_result?.evaluation_result_details.length > 0 &&
          id !== undefined && (
            <>
              <div className='text-xl font-bold mb-2'>Evaluation Scores</div>
              <table className='md:w-[800px]'>
                <thead className='text-left'>
                  <tr>
                    <th className='py-1 border-b-4'>Evaluation</th>
                    <th className='py-1 border-b-4 text-center'>Score</th>
                    <th className='py-1 border-b-4 text-center'>Standard Score</th>
                    <th className='py-1 border-b-4 text-center'>Banding</th>
                  </tr>
                </thead>
                <tbody>
                  {user_evaluation_result?.evaluation_result_details.map((detail) => (
                    <tr key={detail.id}>
                      <td className='py-1 border-b'>{detail.template_name}</td>
                      <td className='py-1 border-b text-center'>{detail.score}</td>
                      <td className='py-1 border-b text-center'>{detail.zscore}</td>
                      <td className='py-1 border-b text-center items-center'>
                        <Banding banding={user_evaluation_result.banding} size='small' />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className='font-bold py-1'>Total Weighted Score: </td>
                    <td className='py-1 text-center'>{user_evaluation_result.score}</td>
                    <td className='py-1 text-center'>{user_evaluation_result.zscore}</td>
                    <td className='py-1 text-center'>
                      <Banding banding={user_evaluation_result.banding} size='small' />
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
      </div>
    </>
  )
}
