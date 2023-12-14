import { useEffect, useState } from "react"
import { debounce } from "lodash"
import { Button, LinkButton } from "../../../../../../../../components/ui/button/button"
import { useAppDispatch } from "../../../../../../../../hooks/useAppDispatch"
import { getActiveTemplates } from "../../../../../../../../redux/slices/evaluation-templates-slice"
import { useAppSelector } from "../../../../../../../../hooks/useAppSelector"
import { type Option } from "../../../../../../../../types/optionType"
import { CustomSelect } from "../../../../../../../../components/ui/select/custom-select"
import Dialog from "../../../../../../../../components/ui/dialog/dialog"
import { useNavigate, useParams } from "react-router-dom"
import { getProjectMembers } from "../../../../../../../../redux/slices/project-members-slice"
import { formatDate } from "../../../../../../../../utils/format-date"
import { getUsers } from "../../../../../../../../redux/slices/users-slice"
import { getExternalUsers } from "../../../../../../../../redux/slices/external-users-slice"
import { type EvaluatorFormData } from "../../../../../../../../types/form-data-type"
import { addEvaluator } from "../../../../../../../../redux/slices/evaluation-administration-slice"
import { setAlert } from "../../../../../../../../redux/slices/appSlice"
import { Loading } from "../../../../../../../../types/loadingType"
import { getEvaluationResult } from "../../../../../../../../redux/slices/evaluation-result-slice"

export const AddEvaluatorForm = () => {
  const navigate = useNavigate()
  const { id, evaluation_result_id, evaluation_template_id } = useParams()

  const appDispatch = useAppDispatch()
  const { loading_evaluators } = useAppSelector((state) => state.evaluationAdministration)
  const { evaluation_result } = useAppSelector((state) => state.evaluationResult)
  const { evaluation_templates } = useAppSelector((state) => state.evaluationTemplates)
  const { project_members } = useAppSelector((state) => state.projectMembers)
  const { external_users } = useAppSelector((state) => state.externalUsers)
  const { users } = useAppSelector((state) => state.users)

  const [activeTemplates, setActiveTemplates] = useState<Option[]>([])
  const [activeUsers, setActiveUsers] = useState<Option[]>([])
  const [activeProjectMembers, setActiveProjectMembers] = useState<Option[]>([])

  const [formData, setFormData] = useState<EvaluatorFormData>({
    id,
    evaluation_template_id,
    evaluation_result_id,
    evaluee_id: "",
    project_member_id: undefined,
    user_id: "",
    is_external: "",
  })

  const [showDialog, setShowDialog] = useState<boolean>(false)

  useEffect(() => {
    if (evaluation_result_id !== undefined) {
      void appDispatch(getEvaluationResult(parseInt(evaluation_result_id)))
      void appDispatch(getActiveTemplates())
      void appDispatch(
        getProjectMembers({
          evaluation_administration_id: id,
          evaluation_result_id,
          evaluation_template_id,
        })
      )
    }
  }, [])

  useEffect(() => {
    if (evaluation_result?.users !== undefined) {
      setFormData({
        ...formData,
        evaluee_id: evaluation_result.users.id.toString(),
      })
    }
  }, [evaluation_result])

  useEffect(() => {
    const templates = [...evaluation_templates]
    const options: Option[] = templates.map((template) => {
      const role =
        template?.project_role?.name !== undefined
          ? ` for ${template?.project_role?.name} Role`
          : ""
      return {
        label: `${template.display_name}${role}`,
        value: template.id.toString(),
      }
    })
    setActiveTemplates(options)
  }, [evaluation_templates])

  useEffect(() => {
    const userList = [...users]
    const options: Option[] = [
      ...userList.map((user) => ({
        label: `${user.last_name}, ${user.first_name}`,
        value: user.id.toString().concat("|0"),
      })),
      ...external_users.map((user) => ({
        label: `${user.last_name}, ${user.first_name} (External)`,
        value: user.id.toString().concat("|1"),
      })),
    ]
    setActiveUsers(options)
  }, [users, external_users])

  useEffect(() => {
    const projectMembers = [...project_members]
    const options: Option[] = projectMembers.map((projectMember) => ({
      label: `${projectMember.project?.name} - ${projectMember.allocation_rate}% (${formatDate(
        projectMember.start_date
      )} to ${formatDate(projectMember.end_date)})`,
      value: projectMember.id.toString(),
    }))
    setActiveProjectMembers(options)
  }, [project_members])

  const toggleDialog = async () => {
    setShowDialog((prev) => !prev)
  }

  const handleSearch = (value: string) => {
    if (value.length !== 0) {
      void appDispatch(
        getUsers({
          name: value,
        })
      )
      void appDispatch(
        getExternalUsers({
          name: value,
        })
      )
    }
  }

  const debouncedSearch = debounce(handleSearch, 500)

  const handleSubmit = async () => {
    try {
      const result = await appDispatch(addEvaluator(formData))
      if (result.type === "evaluationAdministration/addEvaluator/rejected") {
        appDispatch(
          setAlert({
            description: result.payload,
            variant: "destructive",
          })
        )
      }
      if (result.type === "evaluationAdministration/addEvaluator/fulfilled") {
        navigate(
          `/admin/evaluation-administrations/${id}/evaluees/${evaluation_result_id}/evaluators/${formData.evaluation_template_id}`
        )
      }
    } catch (error) {}
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col md:w-1/2 gap-4'>
        <CustomSelect
          data-test-id='TemplateType'
          label='Template Type'
          name='template-type'
          value={activeTemplates.find((option) => option.value === formData.evaluation_template_id)}
          onChange={(option) =>
            setFormData({
              ...formData,
              evaluation_template_id: option !== null ? option.value : "",
            })
          }
          options={activeTemplates}
          fullWidth
        />
        <CustomSelect
          data-test-id='User'
          label='User'
          name='user'
          value={activeUsers.find(
            (option) => option.value === `${formData.user_id}|${formData.is_external}`
          )}
          onChange={(option) => {
            const data = option?.value.split("|")
            if (data?.length === 2) {
              setFormData({
                ...formData,
                user_id: data[0],
                is_external: data[1],
              })
            }
          }}
          onInputChange={(value) => debouncedSearch(value)}
          options={activeUsers}
          fullWidth
        />
        {formData.evaluation_template_id !== "11" && formData.evaluation_template_id !== "12" && (
          <CustomSelect
            data-test-id='ProjectMember'
            label='Project'
            name='project'
            value={activeProjectMembers.find(
              (option) => option.value === formData.project_member_id
            )}
            onChange={(option) =>
              setFormData({
                ...formData,
                project_member_id: option !== null ? option.value : "",
              })
            }
            options={activeProjectMembers}
            fullWidth
          />
        )}
      </div>
      <div className='flex justify-between md:w-1/2'>
        <Button variant='primaryOutline' onClick={toggleDialog}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} loading={loading_evaluators === Loading.Pending}>
          Add
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
          <LinkButton
            variant='primary'
            to={`/admin/evaluation-administrations/${id}/evaluees/${evaluation_result_id}/evaluators/${evaluation_template_id}`}
          >
            Yes
          </LinkButton>
        </Dialog.Actions>
      </Dialog>
    </div>
  )
}
