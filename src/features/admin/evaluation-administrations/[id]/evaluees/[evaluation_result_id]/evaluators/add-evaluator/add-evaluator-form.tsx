import { useEffect, useState, useRef, lazy, Suspense } from "react"
import { type SelectInstance, type GroupBase } from "react-select"
import { debounce } from "lodash"
import { Button } from "@components/ui/button/button"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { getActiveTemplates } from "@redux/slices/evaluation-templates-slice"
import { useAppSelector } from "@hooks/useAppSelector"
import { type Option } from "@custom-types/optionType"
import { CustomSelect } from "@components/ui/select/custom-select"
import { useNavigate, useParams } from "react-router-dom"
import { getProjectMembers } from "@redux/slices/project-members-slice"
import { formatDate } from "@utils/format-date"
import { getUsersOnScroll } from "@redux/slices/users-slice"
import { getExternalUsersOnScroll } from "@redux/slices/external-users-slice"
import { type EvaluatorFormData } from "@custom-types/form-data-type"
import { addEvaluator } from "@redux/slices/evaluation-administration-slice"
import { setAlert } from "@redux/slices/app-slice"
import { Loading } from "@custom-types/loadingType"
import { getEvaluationResult } from "@redux/slices/evaluation-result-slice"

const EvaluationAdminDialog = lazy(
  async () =>
    await import("@features/admin/evaluation-administrations/evaluation-administrations-dialog")
)
export const AddEvaluatorForm = () => {
  const navigate = useNavigate()
  const { id, evaluation_result_id, evaluation_template_id } = useParams()

  const appDispatch = useAppDispatch()
  const { loading_evaluators } = useAppSelector((state) => state.evaluationAdministration)
  const { evaluation_result } = useAppSelector((state) => state.evaluationResult)
  const { evaluation_templates } = useAppSelector((state) => state.evaluationTemplates)
  const { project_members } = useAppSelector((state) => state.projectMembers)
  const {
    external_users,
    loading: externalUsersLoading,
    hasNextPage: externalUsersHasNextPage,
    currentPage: externalUsersCurrentPage,
  } = useAppSelector((state) => state.externalUsers)
  const { users, loading, hasNextPage, currentPage } = useAppSelector((state) => state.users)

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

  const [evaluatorMenuList, setEvaluatorMenuList] = useState<HTMLDivElement | null | undefined>(
    null
  )

  const customEvaluatorRef = useRef<SelectInstance<Option, false, GroupBase<Option>>>(null)

  useEffect(() => {
    if (evaluation_result_id !== undefined) {
      void appDispatch(getEvaluationResult(parseInt(evaluation_result_id)))
      void appDispatch(getActiveTemplates())
      void appDispatch(getUsersOnScroll({}))
      void appDispatch(getExternalUsersOnScroll({}))
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
    const externalUserList = [...external_users]
    const options: Option[] = [
      ...userList.map((user) => ({
        label: `${user.last_name}, ${user.first_name}`,
        value: user.id.toString().concat("|0"),
      })),
      ...externalUserList.map((user) => ({
        label: `${user.last_name}, ${user.first_name} (External)`,
        value: user.id.toString().concat("|1"),
      })),
    ]

    const compareNames = (a: Option, b: Option) => {
      const nameA = a.label.toUpperCase()
      const nameB = b.label.toUpperCase()

      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    }
    const sortedOptions = options.sort(compareNames)

    setActiveUsers(sortedOptions)
  }, [users, external_users])

  useEffect(() => {
    const projectMembers = [...project_members]
    const options: Option[] = projectMembers.map((projectMember) => ({
      label: `${projectMember.project?.name} [${projectMember.role}] - ${
        projectMember.allocation_rate
      }% (${formatDate(projectMember.start_date)} to ${formatDate(projectMember.end_date)})`,
      value: projectMember.id.toString(),
    }))
    setActiveProjectMembers(options)
  }, [project_members])

  useEffect(() => {
    evaluatorMenuList?.addEventListener("scroll", handleEmployeeScroll)
    return () => {
      evaluatorMenuList?.removeEventListener("scroll", handleEmployeeScroll)
    }
  }, [loading, externalUsersLoading, evaluatorMenuList])

  const toggleDialog = async () => {
    setShowDialog((prev) => !prev)
  }

  const handleSearch = (value: string) => {
    if (value.length !== 0) {
      void appDispatch(
        getUsersOnScroll({
          name: value,
        })
      )
      void appDispatch(
        getExternalUsersOnScroll({
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

  const handleEmployeeScroll = () => {
    if (evaluatorMenuList?.scrollTop !== undefined) {
      const scrollPosition = evaluatorMenuList?.scrollTop + evaluatorMenuList.clientHeight
      if (
        scrollPosition !== evaluatorMenuList.scrollHeight ||
        loading === Loading.Pending ||
        (!hasNextPage && !externalUsersHasNextPage)
      ) {
        return
      }
    }
    if (hasNextPage) {
      const newPage = currentPage + 1
      void appDispatch(
        getUsersOnScroll({
          page: newPage.toString(),
        })
      )
    }
    if (externalUsersHasNextPage) {
      const newExternalUserPage = externalUsersCurrentPage + 1
      void appDispatch(
        getExternalUsersOnScroll({
          page: newExternalUserPage.toString(),
        })
      )
    }
  }

  const handleOnEvaluatorMenuOpen = () => {
    setTimeout(() => {
      setEvaluatorMenuList(customEvaluatorRef?.current?.menuListRef)
    }, 100)
  }

  const handleRedirect = () => {
    navigate(
      `/admin/evaluation-administrations/${id}/evaluees/${evaluation_result_id}/evaluators/${evaluation_template_id}`
    )
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col md:w-3/4 gap-4'>
        <CustomSelect
          data-test-id='TemplateType'
          label='Template Type'
          name='template_type'
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
          customRef={customEvaluatorRef}
          onMenuOpen={handleOnEvaluatorMenuOpen}
          data-test-id='Evaluator'
          label='Evaluator'
          name='evaluator'
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
      <Suspense>
        <EvaluationAdminDialog
          open={showDialog}
          title='Cancel'
          description={
            <>
              Are you sure you want to cancel? <br />
              If you cancel, your data won&apos;t be saved.
            </>
          }
          onClose={toggleDialog}
          onSubmit={handleRedirect}
        />
      </Suspense>
    </div>
  )
}
