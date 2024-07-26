import { useEffect, useState, lazy, Suspense } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { ValidationError } from "yup"
import { type SingleValue } from "react-select"

import { Input } from "@components/ui/input/input"
import { TextArea } from "@components/ui/textarea/text-area"
import { Button } from "@components/ui/button/button"
import { CreateSelect } from "@components/ui/select/create-select"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { type EmailTemplateFormData } from "@custom-types/form-data-type"
import { type EmailTemplate } from "@custom-types/email-template-type"
import { type Option } from "@custom-types/optionType"
import { createEmailTemplateSchema } from "@utils/validation/email-template-schema"
import {
  createEmailTemplate,
  getEmailTemplate,
  getEmailTemplates,
  getTemplateTypes,
  updateEmailTemplate,
} from "@redux/slices/email-template-slice"
import { setAlert } from "@redux/slices/app-slice"
import { ToggleSwitch } from "@components/ui/toggle-switch/toggle-switch"
import { removeWhitespace } from "@hooks/remove-whitespace"

interface DefaultDialogProps {
  open: boolean
}

export const EmailTemplateForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const callback = searchParams.get("callback")

  const appDispatch = useAppDispatch()
  const { emailTemplate, templateTypes } = useAppSelector((state) => state.emailTemplate)

  const [formData, setFormData] = useState<EmailTemplateFormData>({
    name: emailTemplate?.name ?? "",
    template_type: emailTemplate?.template_type ?? "",
    is_default: emailTemplate?.is_default ?? false,
    subject: emailTemplate?.subject ?? "",
    content: emailTemplate?.content ?? "",
  })

  const [validationErrors, setValidationErrors] = useState<Partial<EmailTemplateFormData>>({})
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [showDefaultDialog, setShowDefaultDialog] = useState<boolean>(false)
  const [isDefault, setIsDefault] = useState<boolean>(false)
  const [templates, setTemplates] = useState<EmailTemplate[]>([])

  const EmailTemplatesDialog = lazy(
    async () => await import("@features/admin/email-templates/email-templates-dialog")
  )

  useEffect(() => {
    void appDispatch(getTemplateTypes())

    if (id !== undefined) {
      void appDispatch(getEmailTemplate(parseInt(id)))
    }
  }, [])

  useEffect(() => {
    if (emailTemplate !== null) {
      setFormData({
        name: emailTemplate?.name,
        template_type: emailTemplate?.template_type,
        is_default: emailTemplate?.is_default,
        subject: emailTemplate?.subject,
        content: emailTemplate?.content,
      })
      setIsDefault(emailTemplate?.is_default)
    }
  }, [emailTemplate])

  useEffect(() => {
    if (formData.is_default === true) {
      void setDefaultChecking()
    }
  }, [formData.is_default, formData.template_type])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleTextAreaChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const toggleDialog = async () => {
    setShowDialog((prev) => !prev)
  }

  const setTemplate = async (option: SingleValue<Option>) => {
    setFormData({ ...formData, template_type: option?.value })
  }

  const handleClickCheckbox = async (checked: boolean) => {
    if (checked) {
      void setDefaultChecking()
    }
    setShowDefaultDialog(false)
    setFormData({ ...formData, is_default: checked })
    setIsDefault(checked)
  }

  const setDefaultChecking = async () => {
    if (formData.template_type !== undefined) {
      const { payload } = await appDispatch(
        getEmailTemplates({ template_type: formData.template_type, is_default: "true" })
      )

      const existingEmailTemplates = payload.data

      if (
        existingEmailTemplates.length > 0 &&
        emailTemplate?.id !== parseInt(existingEmailTemplates[0].id)
      ) {
        setTemplates(payload.data)
        void setShowDefaultDialog(true)
      }
    }
  }

  const handleSubmit = async () => {
    try {
      await createEmailTemplateSchema.validate(formData, {
        abortEarly: false,
      })
      const parseFormData = {
        ...formData,
        name: removeWhitespace(formData.name as string),
      }
      const result = await appDispatch(createEmailTemplate(parseFormData))
      if (result.type === "emailTemplate/createEmailTemplate/rejected") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      }
      if (result.type === "emailTemplate/createEmailTemplate/fulfilled") {
        navigate(callback ?? "/admin/message-templates")
        appDispatch(
          setAlert({
            description: "Added new message template",
            variant: "success",
          })
        )
      }

      if (templates.length > 0 && formData?.is_default === true) {
        templates.map(
          async (data: EmailTemplate) =>
            await appDispatch(
              updateEmailTemplate({
                id: data.id,
                emailTemplate: {
                  ...data,
                  is_default: false,
                },
              })
            )
        )
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors: Partial<EmailTemplateFormData> = {}
        error.inner.forEach((err) => {
          errors[err.path as keyof EmailTemplateFormData] = err.message
        })
        setValidationErrors(errors)
      }
    }
  }

  const handleUpdate = async () => {
    if (id !== undefined) {
      try {
        await createEmailTemplateSchema.validate(formData, {
          abortEarly: false,
        })
        const parseFormData = {
          ...formData,
          name: removeWhitespace(formData.name as string),
        }
        const result = await appDispatch(
          updateEmailTemplate({
            id: parseInt(id),
            emailTemplate: parseFormData,
          })
        )
        if (result.type === "emailTemplate/updateEmailTemplate/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
        if (result.payload.id !== undefined) {
          if (templates.length > 0 && formData?.is_default === true) {
            templates.map(
              async (data: EmailTemplate) =>
                await appDispatch(
                  updateEmailTemplate({
                    id: data.id,
                    emailTemplate: {
                      ...data,
                      is_default: false,
                    },
                  })
                )
            )
          }
          navigate(callback ?? "/admin/message-templates")
          appDispatch(
            setAlert({
              description: "Updated message template",
              variant: "success",
            })
          )
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          const errors: Partial<EmailTemplateFormData> = {}
          error.inner.forEach((err) => {
            errors[err.path as keyof EmailTemplateFormData] = err.message
          })
          setValidationErrors(errors)
        }
      }
    }
  }

  const handleCancel = () => {
    navigate(callback ?? "/admin/message-templates")
  }

  const DefaultModal = (props: DefaultDialogProps) => {
    const { open } = props
    const defaultTemplate = templates[0] ?? { name: "" }
    return (
      <EmailTemplatesDialog
        open={open}
        title='Confirm default'
        description={
          <>
            {defaultTemplate.name} is currently set as the default template for this type. <br />
            Would you like to use this template instead?
          </>
        }
        onClose={async () => await handleClickCheckbox(false)}
        onSubmit={() => setShowDefaultDialog(false)}
      />
    )
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-4'>
        <div className='w-650'>
          <h2 className='font-medium'>Name</h2>
          <Input
            name='name'
            placeholder='Name'
            value={formData.name}
            onChange={handleInputChange}
            error={validationErrors.name}
            maxLength={255}
          />
        </div>
        <div className='flex flex-wrap gap-4 w-1100'>
          <div className='flex-1'>
            <CreateSelect
              data-test-id='SelectEmailTemplateType'
              label='Template Type'
              name='template_type'
              value={templateTypes.find((option) => option.value === formData.template_type)}
              onChange={async (option) => await setTemplate(option)}
              options={templateTypes}
              fullWidth
              isClearable
              error={validationErrors.template_type}
            />
          </div>
          <div className='flex-1 flex items-center'>
            <div className='flex items-center mt-5'>
              <div className='my-2.5'>
                <ToggleSwitch
                  checked={isDefault}
                  onChange={async (checked) => await handleClickCheckbox(checked)}
                />
              </div>
              <h2 className='font-medium'>Default</h2>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='w-650'>
            <Input
              label='Subject'
              name='subject'
              placeholder='Subject'
              value={formData.subject}
              onChange={handleInputChange}
              error={validationErrors.subject}
              maxLength={255}
            />
          </div>
          <div className='w-9/12'>
            <TextArea
              label='Content'
              name='content'
              placeholder='Content'
              value={formData.content}
              onChange={handleTextAreaChange}
              error={validationErrors.content}
              rows={8}
            />
          </div>
        </div>
      </div>
      <div className='flex justify-between w-9/12'>
        <Button variant='primaryOutline' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button onClick={emailTemplate === null ? handleSubmit : handleUpdate}>Save</Button>
      </div>
      <Suspense>
        <EmailTemplatesDialog
          open={showDialog}
          title='Cancel'
          description={
            <>
              Are you sure you want to cancel? <br />
              If you cancel, your data won&apos;t be saved.
            </>
          }
          onClose={toggleDialog}
          onSubmit={handleCancel}
        />
      </Suspense>
      <Suspense>
        <DefaultModal open={showDefaultDialog} />
      </Suspense>
    </div>
  )
}
