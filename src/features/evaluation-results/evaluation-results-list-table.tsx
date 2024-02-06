import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { getCmEvaluationResults } from "@redux/slices/evaluation-results-slice"
import { Pagination } from "@components/shared/pagination/pagination"
import { useFullPath } from "@hooks/use-full-path"
import { setPreviousUrl } from "@redux/slices/app-slice"
import { Table } from "@components/ui/table/table"
import { type EvaluationResult, columns } from "@custom-types/evaluation-result-type"
import { formatDate } from "@utils/format-date"

export const EvaluationResultsListTable = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fullPath = useFullPath()

  const appDispatch = useAppDispatch()

  const { evaluation_results, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.evaluationResults
  )

  useEffect(() => {
    void appDispatch(
      getCmEvaluationResults({
        name: searchParams.get("name") ?? undefined,
        evaluation_administration_id: searchParams.get("evaluation_administration_id") ?? undefined,
        score_ratings_id: searchParams.get("score_ratings_id") ?? undefined,
        banding: searchParams.get("banding") ?? undefined,
        sort_by: searchParams.get("sort_by") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const handleViewEvaluationResult = (id: number) => {
    appDispatch(setPreviousUrl(fullPath))
    navigate(`/evaluation-results/${id}`)
  }

  const renderCell = (item: EvaluationResult, column: unknown) => {
    switch (column) {
      case "Evaluee Name":
        return `${item.users?.last_name} ${item.users?.first_name}`
      case "Eval Admin Name":
        return `${item.evaluation_administration?.name}`
      case "Eval Period":
        return `${formatDate(
          item.evaluation_administration?.eval_period_start_date
        )} to ${formatDate(item.evaluation_administration?.eval_period_end_date)}`
      case "Score":
        return `${item.score}`
      case "Score Rating":
        return `${item.score_ratings?.display_name}`
      case "Z-Score":
        return `${item.zscore}`
      case "Banding":
        return `${item.banding}`
    }
  }
  return (
    <div className='flex flex-col gap-8 overflow-x-auto'>
      <Table
        columns={columns}
        data={evaluation_results}
        isRowClickable={true}
        renderCell={renderCell}
        onClickRow={handleViewEvaluationResult}
      />
      {totalPages !== 1 && (
        <div className='flex justify-center'>
          <Pagination
            hasPreviousPage={hasPreviousPage}
            hasNextPage={hasNextPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  )
}
