import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ValidationError } from "yup"
import { type SingleValue } from "react-select"

import { Input } from "../../../../components/ui/input/input"
import { TextArea } from "../../../../components/ui/textarea/text-area"
import { Button, LinkButton } from "../../../../components/ui/button/button"
import Dialog from "../../../../components/ui/dialog/dialog"
import { Checkbox } from "../../../../components/ui/checkbox/checkbox"
import { CreateSelect } from "../../../../components/ui/select/create-select"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { type EmailTemplateFormData } from "../../../../types/form-data-type"
import { Loading } from "../../../../types/loadingType"
import { TemplateType } from "../../../../types/email-template-type"
import { type Option } from "../../../../types/optionType"
import { createEmailTemplateSchema } from "../../../../utils/validation/email-template-schema"
import {
  createEmailTemplate,
  getEmailTemplates,
} from "../../../../redux/slices/email-template-slice"
import { setAlert } from "../../../../redux/slices/app-slice"

interface DefaultDialogProps {
  open: boolean
}

export const EmailTemplateForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const callback = searchParams.get("callback")

  const appDispatch = useAppDispatch()
  const { emailTemplate } = useAppSelector((state) => state.emailTemplate)
  const { loading } = useAppSelector((state) => state.emailTemplate)

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
  const [updateDefault, setUpdateDefault] = useState<boolean>(false)
  const [template_type, setTemplateType] = useState<string>(searchParams.get("template_type") ?? "")

  const typeOptions: Option[] = Object.values(TemplateType).map((value) => ({
    label: value,
    value,
  }))

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
    if (formData.is_default === true) {
      void setDefaultChecking()
    }
    setTemplateType(option !== null ? option.value : "")
    setFormData({ ...formData, template_type: option?.value })
  }

  const handleClickCheckbox = async (checked: boolean) => {
    if (checked) {
      void setDefaultChecking()
    }
    setShowDefaultDialog(false)
    setFormData({ ...formData, is_default: checked })
  }

  const setDefaultChecking = async () => {
    const { payload } = await appDispatch(
      getEmailTemplates({ template_type: formData.template_type, is_default: "true" })
    )
    if (payload.data.length > 0) {
      void setShowDefaultDialog(true)
    }
  }

  const handleSubmit = async () => {
    try {
      await createEmailTemplateSchema.validate(formData, {
        abortEarly: false,
      })

      const result = await appDispatch(createEmailTemplate(formData))
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

        if (updateDefault) {
          // TO DO: CREATE API TO UPDATE RECORDS IS_DEFAULT VAL FOR SELECTED TEMPLATE TYPE
        }
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

  const DefaultModal = (props: DefaultDialogProps) => {
    const { open } = props
    return (
      <Dialog open={open}>
        <Dialog.Title>Cancel</Dialog.Title>
        <Dialog.Description>
          {formData.template_type} is currently set as the default template for this type. <br />
          Would you like to use this template instead?
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={async () => await handleClickCheckbox(false)}>
            No
          </Button>
          <Button
            variant='primary'
            onClick={() => {
              setShowDefaultDialog(false)
              setUpdateDefault(true)
            }}
          >
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
    )
  }

  const handleUpdate = async () => {}

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-4'>
        <div>
          <h2 className='font-medium'>Name</h2>
          <Input
            name='name'
            placeholder='Name'
            value={formData.name}
            onChange={handleInputChange}
            error={validationErrors.name}
          />
        </div>
        <div className='flex flex-wrap gap-4'>
          <div className='flex-1'>
            <CreateSelect
              data-test-id='SelectEmailTemplateType'
              label='Template Type'
              name='template_type'
              value={typeOptions.find((option) => option.value === template_type)}
              onChange={async (option) => await setTemplate(option)}
              options={typeOptions}
              fullWidth
              isClearable
              error={validationErrors.template_type}
            />
          </div>
          <div className='flex-1'>
            <h2 className='font-medium'>Default</h2>
            <div className='m-2.5'>
              <Checkbox
                checked={false}
                onChange={async (checked) => await handleClickCheckbox(checked)}
              />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <Input
            label='Subject'
            name='subject'
            placeholder='Subject'
            value={formData.subject}
            onChange={handleInputChange}
            error={validationErrors.subject}
          />
          <TextArea
            label='Content'
            name='content'
            placeholder='Content'
            value={formData.content}
            onChange={handleTextAreaChange}
            error={validationErrors.content}
          />
        </div>
      </div>
      <div className='flex justify-between'>
        <Button variant='primaryOutline' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button
          onClick={emailTemplate === null ? handleSubmit : handleUpdate}
          loading={loading === Loading.Pending}
        >
          Save
        </Button>
      </div>
      <Dialog open={showDialog}>
        <Dialog.Title>Cancel</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to cancel? <br />
          If you cancel, your data won&apos;t be saved.
        </Dialog.Description>
        <Dialog.Actions>
          <Button variant='primaryOutline' onClick={toggleDialog}>
            No
          </Button>
          <LinkButton variant='primary' to={callback ?? "/admin/message-templates"}>
            Yes
          </LinkButton>
        </Dialog.Actions>
      </Dialog>
      <DefaultModal open={showDefaultDialog} />
    </div>
  )
}
