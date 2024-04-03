import { useEffect, useState } from "react"
import { PageTitle } from "@components/shared/page-title"
import { useAppSelector } from "@hooks/useAppSelector"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { Badge } from "@components/ui/badge/badge"
import { getSurveyResultStatusVariant } from "@utils/variant"
import { useNavigate, useParams } from "react-router-dom"
import { SurveyAdministrationStatus } from "@custom-types/survey-administration-type"
import { LinkButton, Button } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import SurveyFormDialog from "./survey-form-dialog"
import { Input } from "@components/ui/input/input"
import { type ExternalUserFormData } from "@custom-types/form-data-type"
import { createExternalUserSurveySchema } from "@utils/validation/external-evaluator-schema"
import { ValidationError } from "yup"
import { createSurveyResults, createExternalUser } from "@redux/slices/user-slice"
import { setAlert } from "@redux/slices/app-slice"

export const SurveyFormHeader = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { id } = useParams()
  const { user_survey_administrations, survey_result_status, user_survey_companions } =
    useAppSelector((state) => state.user)
  const [showCompanionDialog, setShowCompanionDialog] = useState<boolean>(false)
  const [formData, setFormData] = useState<ExternalUserFormData>({
    first_name: "",
    middle_name: "",
    last_name: "",
    user_type: "survey",
  })

  const [validationErrors, setValidationErrors] = useState<Partial<ExternalUserFormData>>({})

  useEffect(() => {
    if (user_survey_administrations[0] !== undefined) {
      if (user_survey_administrations[0]?.status !== SurveyAdministrationStatus.Ongoing) {
        handleRedirect()
      }
    }
  }, [user_survey_administrations])

  const toggleCompanionDialog = () => {
    setFormData({
      first_name: "",
      middle_name: "",
      last_name: "",
      user_type: "survey",
    })
    setValidationErrors({})
    setShowCompanionDialog((prev) => !prev)
  }

  const handleRedirect = () => {
    navigate("/survey-forms")
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setValidationErrors({})
  }

  const handleCancel = () => {
    toggleCompanionDialog()
  }

  const handleAddCompanion = async () => {
    try {
      await createExternalUserSurveySchema.validate(formData, {
        abortEarly: false,
      })
      const result = await appDispatch(createExternalUser(formData))
      if (result.type === "externalUser/createExternalUser/rejected") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      }
      if (result.type === "externalUser/createExternalUser/fulfilled") {
        const resultExternal = await appDispatch(
          createSurveyResults({
            survey_administration_id: id,
            companion_ids: [result.payload.id],
            is_external: true,
          })
        )
        if (resultExternal.type === "surveyResults/createSurveyResults/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        } else if (resultExternal.type === "surveyResults/createSurveyResults/fulfilled") {
          toggleCompanionDialog()
          appDispatch(
            setAlert({
              description: "Successfully added companion",
              variant: "success",
            })
          )
          navigate(`/survey-forms/${id}/companions/${resultExternal.payload.survey_result_id}`)
        }
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<ExternalUserFormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof ExternalUserFormData] = err.message
        })
        setValidationErrors(errors)
      }
    }
  }

  return (
    <>
      <div className='flex md:flex-col justify-between gap-4'>
        <div className='flex gap-4'>
          <div className='flex gap-4 items-center'>
            <PageTitle>{user_survey_administrations[0]?.name}</PageTitle>
            <Badge
              size={"medium"}
              variant={getSurveyResultStatusVariant(survey_result_status ?? "")}
            >
              <div className='uppercase'>{survey_result_status}</div>
            </Badge>
          </div>
        </div>
        <div>{user_survey_administrations[0]?.remarks}</div>
        <b className='text-primary-500'>Companions:</b>
        {user_survey_companions.map((companion) => (
          <div key={companion.id}>
            <LinkButton to={`/survey-forms/${id}/companions/${companion.id}`} variant='ghost'>
              <p className='text-primary-500'>
                - {companion.companion_user?.last_name}, {companion.companion_user?.first_name}
              </p>
              <Badge
                size={"extraSmall"}
                variant={getSurveyResultStatusVariant(companion.status ?? "")}
              >
                <div className='uppercase'>{companion.status ?? ""}</div>
              </Badge>
            </LinkButton>
          </div>
        ))}
        {user_survey_companions.length === 0 ? (
          <div className='pb-4 pl-2'>
            No companions added. Click{" "}
            <span
              onClick={toggleCompanionDialog}
              className='text-primary-500 cursor-pointer underline'
            >
              {" "}
              here
            </span>{" "}
            to add.
          </div>
        ) : (
          <div className='flex justify-start'>
            <Button variant='ghost' onClick={toggleCompanionDialog}>
              <Icon icon='Plus' color='primary' size='small' />{" "}
              <p className='text-primary-500 uppercase whitespace-nowrap text-xs'>Add Companion</p>
            </Button>
          </div>
        )}
      </div>
      <SurveyFormDialog
        open={showCompanionDialog}
        title='Add Companion'
        description={
          <>
            <div className='flex flex-col gap-4 p-1'>
              <div className='flex-1'>
                <Input
                  label='First name'
                  name='first_name'
                  placeholder='First name'
                  value={formData.first_name}
                  onChange={handleInputChange}
                  error={validationErrors.first_name}
                  maxLength={100}
                />
              </div>
              <div className='flex-1'>
                <Input
                  label='Middle name'
                  name='middle_name'
                  placeholder='Middle name'
                  value={formData.middle_name}
                  onChange={handleInputChange}
                  error={validationErrors.middle_name}
                  maxLength={75}
                />
              </div>
              <div className='flex-1'>
                <Input
                  label='Last name'
                  name='last_name'
                  placeholder='Last name'
                  value={formData.last_name}
                  onChange={handleInputChange}
                  error={validationErrors.last_name}
                  maxLength={75}
                />
              </div>
            </div>
          </>
        }
        onClose={handleCancel}
        onSubmit={async () => await handleAddCompanion()}
        submitButtonLabel='Add'
        closeButtonLabel='Cancel'
      />
    </>
  )
}
