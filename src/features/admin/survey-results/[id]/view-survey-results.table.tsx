import { useState } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { Loading } from "@custom-types/loadingType"
import { RespondentViewTable } from "@features/admin/survey-results/[id]/tables/respondent-view-table"
import { AnswerViewTable } from "@features/admin/survey-results/[id]/tables/answer-view-table"
import { Button } from "@components/ui/button/button"

export const ViewSurveyResultsTable = () => {
  const { id } = useParams()
  const { loading, survey_results } = useAppSelector((state) => state.surveyResults)
  const [viewMode, setViewMode] = useState<string>("respondent")

  return (
    <>
      {loading === Loading.Pending && <div>Loading...</div>}
      {loading === Loading.Fulfilled && survey_results === null && <div>Not found</div>}
      <div>
        {loading === Loading.Fulfilled &&
          survey_results !== undefined &&
          survey_results.length > 0 &&
          id !== undefined && (
            <>
              <div className='flex gap-3 mt-4'>
                <Button
                  onClick={() => setViewMode("respondent")}
                  variant={viewMode === "respondent" ? "primary" : "primaryOutline"}
                >
                  By Respondent
                </Button>
                <Button
                  onClick={() => setViewMode("answer")}
                  variant={viewMode === "answer" ? "primary" : "primaryOutline"}
                >
                  By Answer
                </Button>
              </div>
              <div className='overflow-x-auto my-5'>
                {viewMode === "respondent" ? <RespondentViewTable /> : <AnswerViewTable />}
              </div>
            </>
          )}
      </div>
    </>
  )
}
