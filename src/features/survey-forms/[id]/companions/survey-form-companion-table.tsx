import { useEffect, useState } from "react"
import { Badge } from "@components/ui/badge/badge"
import { Button } from "@components/ui/button/button"
import { useMobileView } from "@hooks/use-mobile-view"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import {
  getCompanionSurveyQuestions,
  saveSurveyAnswersAsDraft,
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
import { Icon } from "@components/ui/icon/icon"
import Tooltip from "@components/ui/tooltip/tooltip"
import useSmoothScrollToTop from "@hooks/use-smooth-scroll-to-top"

export const SurveyFormCompanionTable = () => {
  const isMobile = useMobileView()
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()
  const scrollToTop = useSmoothScrollToTop()
  const { id, survey_result_id } = useParams()
  const { loading, user_companion_questions, survey_result_status, user_survey_answers } =
    useAppSelector((state) => state.user)
  const [selectedCategory, setSelectedCategory] = useState<Record<number, SurveyTemplateCategory>>(
    {}
  )
  const [totalAmount, setTotalAmount] = useState<Record<number, number>>({})
  const [selectedSurveyAnswerIds, setSelectedSurveyAnswerIds] = useState<number[]>([])
  const [selectedSurveyAnswers, setSelectedSurveyAnswers] = useState<
    Array<SurveyTemplateAnswer | undefined>
  >([])
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswer[]>([])
  const [maxLimits, setMaxLimits] = useState<Record<string, number>>({})
  const [showSaveAsDraftDialog, setShowSaveAsDraftDialog] = useState<boolean>(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState<boolean>(false)
  const [showBackDialog, setShowBackDialog] = useState<boolean>(false)

  useEffect(() => {
    if (id !== undefined && survey_result_id !== undefined) {
      void appDispatch(getCompanionSurveyQuestions(parseInt(survey_result_id)))
    }
  }, [])

  useEffect(() => {
    if (user_companion_questions.length > 0) {
      for (const question of user_companion_questions) {
        const questionId = question.id
        if (questionId !== undefined) {
          getQuestionRules(questionId, question.survey_template_question_rules)
          if (question.surveyTemplateCategories !== undefined) {
            const selectedCategory = question.surveyTemplateCategories

            setSelectedCategory((prev) => ({
              ...prev,
              [questionId]: selectedCategory[0],
            }))
          }
        }
      }
    }
  }, [user_companion_questions])

  useEffect(() => {
    const selectedAnswerIds = user_survey_answers
      .map((answer) => answer.survey_template_answer_id ?? 0)
      .filter((answerId) => answerId !== 0)

    const selectedSurveyTemplateAnswers = user_survey_answers.map((answer) => {
      return {
        ...answer.survey_template_answers,
      }
    })

    setSelectedSurveyAnswerIds(selectedAnswerIds)
    setSelectedSurveyAnswers(selectedSurveyTemplateAnswers)
    setSurveyAnswers(user_survey_answers)
  }, [user_survey_answers])

  useEffect(() => {
    if (user_companion_questions.length > 0) {
      for (const question of user_companion_questions) {
        setTotalAmount((prev) => ({
          ...prev,
          [question.id as number]: question.totalAmount as number,
        }))
      }
    }
  }, [user_companion_questions])

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

  const handleRedirect = () => {
    navigate(`/survey-forms/${id}`)
  }

  const toggleBackDialog = () => {
    setShowBackDialog((prev) => !prev)
  }

  const toggleSaveAsDraftDialog = () => {
    setShowSaveAsDraftDialog((prev) => !prev)
  }

  const toggleSubmitDialog = () => {
    setShowSubmitDialog((prev) => !prev)
  }

  const handleSelectItem = (
    choice: SurveyTemplateAnswer | undefined,
    isChecked: boolean,
    questionId: number
  ) => {
    const choiceAmount = parseInt(choice?.amount as string)
    const choiceId = choice?.id

    setTotalAmount((prev) => ({
      ...prev,
      [questionId]: isChecked
        ? (prev[questionId] ?? 0) + choiceAmount
        : (prev[questionId] ?? 0) - choiceAmount,
    }))

    if (isChecked) {
      setSelectedSurveyAnswerIds((prev) => [...prev, choiceId ?? 0])
      setSelectedSurveyAnswers((prev) => [...prev, choice])
      setSurveyAnswers((prev) => [
        ...prev,
        {
          survey_template_answer_id: choiceId,
          survey_template_question_id: questionId,
        },
      ])
    } else {
      setSelectedSurveyAnswerIds((prev) => prev.filter((id) => id !== choiceId))
      setSelectedSurveyAnswers((prev) => prev.filter((answer) => answer?.id !== choiceId))
      setSurveyAnswers(
        surveyAnswers.filter((answer) => answer?.survey_template_answer_id !== choiceId)
      )
    }
  }

  const handleClear = () => {
    setSelectedSurveyAnswerIds([])
    setSelectedSurveyAnswers([])
    setSurveyAnswers([])
    setTotalAmount((prev) => {
      const updatedTotalAmount: Record<number, number> = {}
      for (const key in prev) {
        updatedTotalAmount[key] = 0
      }
      return updatedTotalAmount
    })
  }

  const handleSaveAsDraft = async () => {
    try {
      if (id !== undefined && survey_result_id !== undefined) {
        const result = await appDispatch(
          saveSurveyAnswersAsDraft({
            survey_administration_id: parseInt(id),
            survey_answers: surveyAnswers,
            is_external: true,
            survey_result_id: parseInt(survey_result_id),
          })
        )
        if (result.type === "user/saveSurveyAnswersAsDraft/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
          scrollToTop()
        }
        if (result.type === "user/saveSurveyAnswersAsDraft/fulfilled") {
          appDispatch(
            setAlert({
              description: "Successfully saved survey answers as draft",
              variant: "success",
            })
          )
          appDispatch(updateSurveyResultStatus(SurveyResultStatus.Draft))
          if (survey_result_id !== undefined) {
            void appDispatch(getCompanionSurveyQuestions(parseInt(survey_result_id)))
          }
          navigate(`/survey-forms/${id}`)
        }
      }
    } catch (error) {}
  }

  const handleSubmit = async () => {
    try {
      if (id !== undefined && survey_result_id !== undefined) {
        const result = await appDispatch(
          submitSurveyAnswers({
            survey_administration_id: parseInt(id),
            survey_answers: surveyAnswers,
            is_external: true,
            survey_result_id: parseInt(survey_result_id),
          })
        )
        if (result.type === "user/submitSurveyAnswers/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
          scrollToTop()
        }
        if (result.type === "user/submitSurveyAnswers/fulfilled") {
          appDispatch(
            setAlert({
              description: "Successfully submitted survey answers",
              variant: "success",
            })
          )
          appDispatch(updateSurveyResultStatus(SurveyResultStatus.Submitted))
          if (survey_result_id !== undefined) {
            void appDispatch(getCompanionSurveyQuestions(parseInt(survey_result_id)))
          }
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
        {loading === Loading.Fulfilled && user_companion_questions !== null && (
          <>
            {user_companion_questions.map((question) => (
              <div key={question.id} className='mb-10'>
                <p className='mb-1 font-bold flex items-center gap-5'>
                  {question.id}
                  {"."} {question.question_text}
                  {question.is_required === true && <span className='text-red-500'>*</span>}
                </p>
                <div className='flex gap-2 items-center mb-4 flex-wrap'>
                  <div className='flex items-center w-full md:w-auto'>
                    <p className='mr-2'>Total Amount:</p>
                    <Badge variant='darkPurple' size='medium'>
                      Php {totalAmount[question.id ?? 0] ?? 0}
                    </Badge>
                  </div>
                  <div className='w-full md:w-auto flex justify-start flex-wrap gap-2'>
                    {selectedSurveyAnswers.map((answer, index) => (
                      <div key={index}>
                        <Button
                          fullWidth
                          variant='tag'
                          size='small'
                          fullHeight
                          onClick={() => {
                            if (answer !== undefined) {
                              handleSelectItem(answer, false, question.id ?? 0)
                            }
                          }}
                          disabled={survey_result_status === SurveyResultStatus.Submitted}
                        >
                          <p>
                            {answer?.answer_text} (Php {answer?.amount})
                          </p>
                          <Icon icon='Close' size={"extraSmall"} />
                        </Button>
                      </div>
                    ))}
                    {selectedSurveyAnswers.length > 0 &&
                      survey_result_status !== SurveyResultStatus.Submitted && (
                        <Button variant='textLink' size='small' onClick={handleClear}>
                          Clear All
                        </Button>
                      )}
                  </div>
                </div>
                {survey_result_status === SurveyResultStatus.Submitted ? (
                  <div className='flex w-full'>
                    <div
                      className={`${
                        isMobile ? "justify-center" : "justify-left"
                      } flex flex-wrap gap-2 mt-1 p-2 overflow-y-auto overflow-x-hidden bg-gray-50 w-full`}
                    >
                      {selectedSurveyAnswers?.map((choice, index) => (
                        <label
                          key={index}
                          className='flex-shrink-0 overflow-hidden rounded-lg max-w-xs'
                        >
                          <div
                            key={index}
                            className={`flex-grow max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 `}
                          >
                            <div className={`${isMobile ? "w-40" : "w-56"} min-h-[250px]`}>
                              <SurveyImage
                                altText={`Image of ${choice?.answer_text}`}
                                imageUrl={getSurveyImage(
                                  choice?.answer_image ?? "",
                                  choice?.survey_template_id as string
                                )}
                                variant={"brokenImage"}
                              />
                              <div className='p-4'>
                                <div className='flex items-start justify-start gap-2'>
                                  <h5 className='ml-5 mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white'>
                                    {choice?.answer_text ?? ""}
                                  </h5>
                                </div>
                                <div
                                  className={`mb-1 ml-2 pr-2.5 text-gray-700 text-xs dark:text-gray-400 px-3 break-words`}
                                >
                                  {choice?.answer_description != null &&
                                  choice?.answer_description.length > 55 ? (
                                    <Tooltip placement='top' wFit={false} size='medium'>
                                      <Tooltip.Trigger>
                                        <p>{`${choice?.answer_description.slice(0, 55)}...`}</p>
                                      </Tooltip.Trigger>
                                      <Tooltip.Content>
                                        <p className=' break-words whitespace-pre-wrap'>
                                          {choice?.answer_description ?? ""}
                                        </p>
                                      </Tooltip.Content>
                                    </Tooltip>
                                  ) : (
                                    <p>{choice?.answer_description}</p>
                                  )}
                                </div>
                                <div className='font-bold ml-2 px-3 text-xs'>
                                  Price: Php {choice?.amount ?? ""}
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className='flex h-450 w-full'>
                    <div className='flex flex-col overflow-auto w-2/4 md:w-2/6 p-2 mr-2'>
                      {question.surveyTemplateCategories?.map((category, index) => (
                        <div key={index} className='border-b text-primary-500 text-left'>
                          <Button
                            fullWidth
                            variant={
                              selectedCategory[question.id ?? 0]?.id === category.id
                                ? "primary"
                                : "ghost"
                            }
                            size='small'
                            fullHeight
                            onClick={() =>
                              setSelectedCategory((prevState) => ({
                                ...prevState,
                                [question.id ?? 0]: category,
                              }))
                            }
                          >
                            <p className='w-full text-left'>{category.name}</p>
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div
                      className={`flex flex-wrap gap-2 mt-1 p-2 h-450 overflow-y-auto overflow-x-hidden bg-gray-50 w-21/25`}
                    >
                      {selectedCategory[question.id ?? 0]?.surveyTemplateAnswers?.map((choice) => (
                        <label
                          key={choice.id}
                          className='flex-shrink-0 overflow-hidden rounded-lg max-w-xs cursor-pointer'
                        >
                          <div
                            key={choice.id}
                            className={`flex-grow max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 `}
                          >
                            <div className={`${isMobile ? "w-40" : "w-56"} min-h-[250px]`}>
                              <SurveyImage
                                altText={`Image of ${choice.answer_text}`}
                                imageUrl={getSurveyImage(
                                  choice.answer_image ?? "",
                                  choice.survey_template_id as string
                                )}
                                variant={"brokenImage"}
                              />
                              <div className='p-4'>
                                <div className='flex items-start justify-start gap-2'>
                                  <div>
                                    <Checkbox
                                      checked={selectedSurveyAnswerIds.includes(choice?.id ?? 0)}
                                      onChange={(checked) =>
                                        handleSelectItem(choice, checked, question.id ?? 0)
                                      }
                                      disabled={
                                        survey_result_status === SurveyResultStatus.Submitted ||
                                        (!selectedSurveyAnswerIds.includes(choice?.id ?? 0) &&
                                          parseInt(choice.amount as string) +
                                            (totalAmount[question.id ?? 0] ?? 0) >
                                            maxLimits[question.id ?? 0])
                                      }
                                    />
                                  </div>
                                  <h5 className='text-sm font-bold tracking-tight text-gray-900 dark:text-white'>
                                    {choice.answer_text ?? ""}
                                  </h5>
                                </div>
                                <div
                                  className={`mb-1 ml-2.5 pr-2.5 text-gray-700 text-xs dark:text-gray-400 px-3 break-words`}
                                >
                                  {choice.answer_description != null &&
                                  choice.answer_description.length > 55 ? (
                                    <Tooltip placement='top' wFit={false} size='medium'>
                                      <Tooltip.Trigger>
                                        <p>{`${choice.answer_description.slice(0, 55)}...`}</p>
                                      </Tooltip.Trigger>
                                      <Tooltip.Content wFullOnMd={false}>
                                        <p className='break-words whitespace-pre-wrap'>
                                          {choice.answer_description ?? ""}
                                        </p>
                                      </Tooltip.Content>
                                    </Tooltip>
                                  ) : (
                                    <p>{choice.answer_description}</p>
                                  )}
                                </div>
                                <div className='font-bold ml-2.5 px-3 text-xs'>
                                  Price: Php {choice.amount}
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
      <div className='flex justify-between'>
        <Button
          variant='primaryOutline'
          onClick={() =>
            survey_result_status === SurveyResultStatus.Submitted
              ? handleRedirect()
              : toggleBackDialog()
          }
        >
          {survey_result_status === SurveyResultStatus.Submitted ? "Back" : "Cancel & Exit"}
        </Button>
        {survey_result_status !== SurveyResultStatus.Submitted && (
          <div className='flex flex-col md:flex-row gap-2'>
            <Button
              variant='primary'
              disabled={survey_result_status === SurveyResultStatus.Submitted}
              onClick={toggleSaveAsDraftDialog}
            >
              Save as Draft
            </Button>
            <Button
              variant='primary'
              disabled={survey_result_status === SurveyResultStatus.Submitted}
              onClick={toggleSubmitDialog}
            >
              Save & Submit
            </Button>
          </div>
        )}
      </div>
      <CustomDialog
        open={showBackDialog}
        title={survey_result_status === SurveyResultStatus.Submitted ? "Go Back" : "Cancel"}
        description={
          survey_result_status === SurveyResultStatus.Submitted ? (
            <>
              Are you sure you want to go back? <br />
              If you do, your data won&apos;t be saved.
            </>
          ) : (
            <>
              Are you sure you want to cancel? <br />
              If you cancel, your data won&apos;t be saved.
            </>
          )
        }
        onClose={toggleBackDialog}
        onSubmit={handleRedirect}
      />
      {survey_result_status !== SurveyResultStatus.Submitted && (
        <>
          <CustomDialog
            open={showSaveAsDraftDialog}
            title='Save Survey as Draft '
            description='Are you sure you want to save your answers as draft?'
            onClose={toggleSaveAsDraftDialog}
            onSubmit={async () => {
              toggleSaveAsDraftDialog()
              await handleSaveAsDraft()
            }}
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
        </>
      )}
    </div>
  )
}
