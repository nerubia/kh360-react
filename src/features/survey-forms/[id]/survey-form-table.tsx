import { useEffect, useState } from "react"
import { Badge } from "@components/ui/badge/badge"
import { Button } from "@components/ui/button/button"
import { useMobileView } from "@hooks/use-mobile-view"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import {
  getUserSurveyQuestions,
  submitSurveyAnswers,
  updateSurveyResultStatus,
} from "@redux/slices/user-slice"
import { useAppSelector } from "@hooks/useAppSelector"
import { Loading } from "@custom-types/loadingType"
import { Spinner } from "@components/ui/spinner/spinner"
import { type SurveyTemplateCategory } from "@custom-types/survey-template-category-type"
import { getSurveyImage } from "@utils/images"
import SurveyImage from "@components/ui/image/survey-image"
import { type SurveyTemplateAnswer } from "@custom-types/survey-template-answer-type"
import { Checkbox } from "@components/ui/checkbox/checkbox"
import { type SurveyTemplateQuestionRule } from "@custom-types/survey-template-question-rule-type"
import { type SurveyAnswer } from "@custom-types/survey-answer-type"
import { setAlert } from "@redux/slices/app-slice"
import { SurveyResultStatus } from "@custom-types/survey-result-type"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"

export const SurveyFormTable = () => {
  const isMobile = useMobileView()
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { loading, user_survey_questions, survey_result_status, user_survey_answers } =
    useAppSelector((state) => state.user)
  const [selectedCategory, setSelectedCategory] = useState<SurveyTemplateCategory>()
  const [totalAmount, setTotalAmount] = useState<Record<number, number>>({})
  const [selectedSurveyAnswerIds, setSelectedSurveyAnswerIds] = useState<number[]>([])
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswer[]>([])
  const [maxLimits, setMaxLimits] = useState<Record<string, number>>({})
  const [showSubmitDialog, setShowSubmitDialog] = useState<boolean>(false)
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false)

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(getUserSurveyQuestions({ survey_administration_id: parseInt(id) }))
    }
  }, [])

  useEffect(() => {
    if (user_survey_questions.length > 0) {
      const firstQuestion = user_survey_questions[0]
      if (firstQuestion.surveyTemplateCategories !== undefined) {
        setSelectedCategory(firstQuestion.surveyTemplateCategories[0])
      }

      for (const question of user_survey_questions) {
        if (question.id !== undefined) {
          getQuestionRules(question.id, question.survey_template_question_rules)
        }
      }
    }
  }, [user_survey_questions])

  useEffect(() => {
    const selectedAnswerIds = user_survey_answers
      .map((answer) => answer.survey_template_answer_id ?? 0)
      .filter((answerId) => answerId !== 0)

    setSelectedSurveyAnswerIds(selectedAnswerIds)
    setSurveyAnswers(user_survey_answers)

    for (const question of user_survey_questions) {
      let totalAmount = 0

      if (question.surveyTemplateCategories !== undefined) {
        for (const category of question.surveyTemplateCategories) {
          if (category.surveyTemplateAnswers !== undefined) {
            for (const answer of category.surveyTemplateAnswers) {
              if (selectedSurveyAnswerIds.includes(answer.id ?? 0)) {
                totalAmount += parseInt(answer.amount as string)
              }
            }
          }
        }
        setTotalAmount((prev) => ({
          ...prev,
          [question.id as number]: totalAmount,
        }))
      }
    }
  }, [user_survey_answers])

  const getQuestionRules = (id: number, rules?: SurveyTemplateQuestionRule[]) => {
    if (rules !== undefined) {
      const maxLimitRule = rules.find((rule) => rule.rule_key === "max_limit")

      if (maxLimitRule !== undefined) {
        const maxLimit = parseInt(maxLimitRule.rule_value as string) ?? 0
        setMaxLimits((prevState) => ({
          ...prevState,
          [id]: maxLimit,
        }))
      }
    }
  }

  const handleCancel = () => {
    navigate("/survey-forms")
  }

  const toggleCancelDialog = () => {
    setShowCancelDialog((prev) => !prev)
  }

  const toggleSubmitDialog = () => {
    setShowSubmitDialog((prev) => !prev)
  }

  const handleSelectItem = (
    choice: SurveyTemplateAnswer,
    isChecked: boolean,
    questionId: number
  ) => {
    const choiceAmount = parseInt(choice.amount as string)
    const choiceId = choice.id

    setTotalAmount((prev) => ({
      ...prev,
      [questionId]: isChecked
        ? (prev[questionId] ?? 0) + choiceAmount
        : (prev[questionId] ?? 0) - choiceAmount,
    }))

    if (isChecked) {
      setSelectedSurveyAnswerIds((prev) => [...prev, choiceId ?? 0])
      setSurveyAnswers((prev) => [
        ...prev,
        {
          survey_template_answer_id: choiceId,
          survey_template_question_id: questionId,
        },
      ])
    } else {
      setSelectedSurveyAnswerIds((prev) => prev.filter((id) => id !== choiceId))
      setSurveyAnswers(
        surveyAnswers.filter((answer) => answer.survey_template_answer_id !== choiceId)
      )
    }
  }

  const handleSubmit = async () => {
    try {
      if (id !== undefined) {
        const result = await appDispatch(
          submitSurveyAnswers({
            survey_administration_id: parseInt(id),
            survey_answers: surveyAnswers,
          })
        )
        if (result.type === "user/submitSurveyAnswers/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
        if (result.type === "user/submitSurveyAnswers/fulfilled") {
          appDispatch(
            setAlert({
              description: "Successfully submitted survey answers",
              variant: "success",
            })
          )
          appDispatch(updateSurveyResultStatus(SurveyResultStatus.Completed))
        }
      }
    } catch (error) {}
  }

  return (
    <div>
      <div>
        {loading === Loading.Pending && (
          <div className='text-center'>
            <Spinner />
          </div>
        )}
        {loading === Loading.Fulfilled && user_survey_questions !== null && (
          <>
            {user_survey_questions.map((question) => (
              <div key={question.id} className='mb-10'>
                <p className='mb-1 font-bold flex items-center gap-5'>
                  {question.id}
                  {"."} {question.question_text}
                  {question.is_required === true && <span className='text-red-500'>*</span>}
                </p>
                <div className='flex gap-2 items-center mb-5 ml-4'>
                  <p>Total Amount: </p>
                  <Badge variant='darkPurple' size='medium'>
                    {totalAmount[question.id ?? 0] ?? 0}
                  </Badge>
                </div>
                <div className='flex flex-row gap-4 overflow-auto whitespace-nowrap'>
                  {question.surveyTemplateCategories?.map((category, index) => (
                    <div key={index}>
                      <div className='mb-4'>
                        <Button
                          fullWidth
                          variant={
                            selectedCategory?.id === category.id ? "primary" : "primaryOutline"
                          }
                          size='small'
                          fullHeight
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category.name}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='flex flex-wrap justify-center gap-1 mt-1 h-96 overflow-y-auto overflow-x-hidden bg-gray-50'>
                  {selectedCategory?.surveyTemplateAnswers?.map((choice) => (
                    <label
                      key={choice.id}
                      className='flex-shrink-0 relative overflow-hidden rounded-lg max-w-xs shadow-lg cursor-pointer'
                    >
                      <div
                        key={choice.id}
                        className={`flex-grow max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 h-full`}
                      >
                        <div className={`${isMobile ? "w-64" : "w-48"} h-full relative 2xl:w-96`}>
                          <SurveyImage
                            altText={`Image of ${choice.answer_text}`}
                            imageUrl={getSurveyImage(choice.answer_image ?? "", id ?? "")}
                            variant={"brokenImage"}
                          />
                          <div className='p-5 2xl:w-80'>
                            <div className='flex items-start justify-start gap-2'>
                              <div className='mt-1'>
                                <Checkbox
                                  checked={selectedSurveyAnswerIds.includes(choice?.id ?? 0)}
                                  onChange={(checked) =>
                                    handleSelectItem(choice, checked, question.id ?? 0)
                                  }
                                  disabled={
                                    survey_result_status === SurveyResultStatus.Completed ||
                                    (!selectedSurveyAnswerIds.includes(choice?.id ?? 0) &&
                                      parseInt(choice.amount as string) +
                                        (totalAmount[question.id ?? 0] ?? 0) >
                                        maxLimits[question.id ?? 0])
                                  }
                                />
                              </div>
                              <h5 className='text-xl font-bold tracking-tight text-gray-900 dark:text-white'>
                                {choice.answer_text ?? ""}
                              </h5>
                            </div>
                            <p className='mb-1 ml-2.5 font-normal text-gray-700 dark:text-gray-400 whitespace-pre-wrap px-3 break-words'>
                              {choice.answer_description ?? ""}
                            </p>
                            <div className='font-bold ml-2.5 px-3'>Price: {choice.amount}</div>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className='flex justify-between'>
        <Button variant='primaryOutline' onClick={toggleCancelDialog}>
          Cancel & Exit
        </Button>
        <Button
          variant='primary'
          disabled={survey_result_status === SurveyResultStatus.Completed}
          onClick={toggleSubmitDialog}
        >
          Save & Submit
        </Button>
      </div>
      <CustomDialog
        open={showCancelDialog}
        title='Cancel'
        description={
          <>
            Are you sure you want to cancel? <br />
            If you cancel, your data won&apos;t be saved.
          </>
        }
        onClose={toggleCancelDialog}
        onSubmit={handleCancel}
      />
      <CustomDialog
        open={showSubmitDialog}
        title='Submit Survey'
        description='Are you sure you want to submit your answers?'
        onClose={toggleSubmitDialog}
        onSubmit={async () => {
          toggleSubmitDialog()
          await handleSubmit()
        }}
      />
    </div>
  )
}
