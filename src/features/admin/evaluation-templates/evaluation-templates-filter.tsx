import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Input } from "../../../components/ui/input/input"
import { Button } from "../../../components/ui/button/button"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import { getTemplateTypes } from "../../../redux/slices/evaluation-templates-slice"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { type Option } from "../../../types/optionType"
import { CustomSelect } from "../../../components/ui/select/custom-select"
import { getAllProjectRoles } from "../../../redux/slices/project-roles-slice"

export const EvaluationTemplatesFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const appDispatch = useAppDispatch()

  const { template_types } = useAppSelector((state) => state.evaluationTemplates)
  const { project_roles } = useAppSelector((state) => state.projectRoles)

  const [templateTypes, setTemplateTypes] = useState<Option[]>([])
  const [evaluatorRoles, setEvaluatorRoles] = useState<Option[]>([])
  const [evalueeRoles, setEvalueeRoles] = useState<Option[]>([])

  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const [displayName, setDisplayName] = useState<string>(searchParams.get("display_name") ?? "")
  const [templateType, setTemplateType] = useState<string>(
    searchParams.get("template_type") ?? "all"
  )
  const [evaluatorRoleId, setEvaluatorRoleId] = useState<string>(
    searchParams.get("evaluator_role_id") ?? "all"
  )
  const [evalueeRoleId, setEvalueeRoleId] = useState<string>(
    searchParams.get("evaluee_role_id") ?? "all"
  )

  useEffect(() => {
    void appDispatch(getTemplateTypes())
    void appDispatch(getAllProjectRoles())
  }, [])

  useEffect(() => {
    const filterOptions: Option[] = template_types.map((evalTemplate) => ({
      label: evalTemplate.template_type ?? "",
      value: evalTemplate.template_type ?? "",
    }))
    filterOptions.unshift({
      label: "All",
      value: "all",
    })
    setTemplateTypes(filterOptions)
  }, [template_types])

  useEffect(() => {
    const filterOptions: Option[] = project_roles.map((projectRole) => ({
      label: projectRole.short_name ?? "",
      value: projectRole.id.toString(),
    }))
    filterOptions.unshift({
      label: "All",
      value: "all",
    })
    setEvaluatorRoles(filterOptions)

    const evalueeRoleOptions: Option[] = project_roles
      .filter((projectRole) => projectRole.is_evaluee === true)
      .map((projectRole) => ({
        label: projectRole.short_name ?? "",
        value: projectRole.id.toString(),
      }))
    evalueeRoleOptions.unshift({
      label: "All",
      value: "all",
    })
    setEvalueeRoles(evalueeRoleOptions)
  }, [project_roles])

  const handleSearch = async () => {
    if (name.length !== 0) {
      searchParams.set("name", name)
    } else {
      searchParams.delete("name")
    }
    if (displayName.length !== 0) {
      searchParams.set("display_name", displayName)
    } else {
      searchParams.delete("display_name")
    }
    if (templateType.length !== 0) {
      searchParams.set("template_type", templateType)
    } else {
      searchParams.delete("template_type")
    }
    if (evaluatorRoleId.length !== 0) {
      searchParams.set("evaluator_role_id", evaluatorRoleId)
    } else {
      searchParams.delete("evaluator_role_id")
    }
    if (evalueeRoleId.length !== 0) {
      searchParams.set("evaluee_role_id", evalueeRoleId)
    } else {
      searchParams.delete("evaluee_role_id")
    }
    searchParams.set("page", "1")
    setSearchParams(searchParams)
  }

  const handleClear = async () => {
    setName("")
    setDisplayName("")
    setTemplateType("all")
    setEvaluatorRoleId("all")
    setEvalueeRoleId("all")
    setSearchParams({})
  }

  return (
    <div className='flex flex-col xl:flex-row justify-between gap-4'>
      <div className='flex-1 flex flex-col xl:flex-row gap-4'>
        <div className='flex-1'>
          <Input
            label='Name'
            name='searchName'
            placeholder='Search by name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='flex-1'>
          <Input
            label='Display Name'
            name='displayName'
            placeholder='Search by display name'
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className='flex-1'>
          <CustomSelect
            data-test-id='TemplateType'
            label='Template Type'
            name='template_type'
            value={templateTypes.find((option) => option.value === templateType)}
            onChange={(option) => setTemplateType(option !== null ? option.value : "all")}
            options={templateTypes}
            fullWidth
          />
        </div>
        <CustomSelect
          data-test-id='EvaluatorRole'
          label='Evaluator Role'
          name='evaluator_role'
          value={evaluatorRoles.find((option) => option.value === evaluatorRoleId)}
          onChange={(option) => setEvaluatorRoleId(option !== null ? option.value : "all")}
          options={evaluatorRoles}
          fullWidth
        />
        <CustomSelect
          data-test-id='EvalueeRole'
          label='Evaluee Role'
          name='evaluee_role'
          value={evalueeRoles.find((option) => option.value === evalueeRoleId)}
          onChange={(option) => setEvalueeRoleId(option !== null ? option.value : "all")}
          options={evalueeRoles}
          fullWidth
        />
      </div>
      <div className='flex items-end gap-4'>
        <Button onClick={handleSearch}>Search</Button>
        <Button variant='primaryOutline' onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  )
}
