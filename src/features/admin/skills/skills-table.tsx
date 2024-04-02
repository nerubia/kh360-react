import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { useEffect, useState, lazy, Suspense } from "react"
import { Button } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { Pagination } from "@components/shared/pagination/pagination"
import { setAlert } from "@redux/slices/app-slice"
import { Badge } from "@components/ui/badge/badge"
import { skillColumns } from "@custom-types/skill-type"
import { Table } from "@components/ui/table/table"
import { getSkills, setSkills } from "@redux/slices/skills-slice"
import { type Skill } from "@custom-types/skill-type"
import { setSelectedSkillId, deleteSkill } from "@redux/slices/skill-slice"
import { SkillForm } from "./skill-form/skill-form"
import { Loading } from "@custom-types/loadingType"

export const SkillsTable = () => {
  const [searchParams] = useSearchParams()
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const appDispatch = useAppDispatch()
  const [showEditSkillForm, setShowEditSkillForm] = useState<boolean>(false)

  const { skills, hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.skills
  )
  const { loading, selectedSkillId } = useAppSelector((state) => state.skill)

  const SkillsDialog = lazy(async () => await import("@features/admin/skills/skills-dialog"))

  useEffect(() => {
    void appDispatch(
      getSkills({
        name: searchParams.get("name") ?? undefined,
        skill_category_id: searchParams.get("skill_category_id") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        page: searchParams.get("page") ?? undefined,
        items: "20",
      })
    )
  }, [searchParams])

  const handleShowEdit = (id: number | null) => {
    if (id !== null) {
      void appDispatch(setSelectedSkillId(id))
    }
    setShowEditSkillForm((prev) => !prev)
  }

  const handleDelete = async () => {
    if (selectedSkillId !== null) {
      try {
        const result = await appDispatch(deleteSkill(selectedSkillId))
        if (result.type === "skill/deleteSkill/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
          setShowDialog((prev) => !prev)
        }
        if (result.type === "skill/deleteSkill/fulfilled") {
          appDispatch(
            setAlert({
              description: "Skill deleted successfully",
              variant: "success",
            })
          )
          const updatedData = skills.filter((skill) => skill.id !== parseInt(result.payload.id))
          void appDispatch(setSkills(updatedData))
          toggleDialog(null)
        }
      } catch (err) {}
    }
  }

  const toggleDialog = (id: number | null) => {
    if (id !== null) {
      void appDispatch(setSelectedSkillId(id))
    }
    setShowDialog((prev) => !prev)
  }

  const renderCell = (item: Skill, column: unknown) => {
    switch (column) {
      case "Name":
        return `${item.name}`
      case "Category":
        return `${item.skill_categories.name}`
      case "Description":
        return `${item.description ?? ""}`
      case "Status":
        return (
          <Badge variant={`${item.status ? "green" : "gray"}`} size='small'>
            {item.status ? "ACTIVE" : "INACTIVE"}
          </Badge>
        )
      case "Actions":
        return (
          <div className='flex gap-2 justify-center'>
            <Button testId='EditButton' variant='unstyled' onClick={() => handleShowEdit(item.id)}>
              <Icon icon='PenSquare' size='extraSmall' color='gray' />
            </Button>
            <Button testId='DeleteButton' variant='unstyled' onClick={() => toggleDialog(item.id)}>
              <Icon icon='Trash' size='extraSmall' color='gray' />
            </Button>
          </div>
        )
    }
  }

  return (
    <>
      <div className='flex flex-col gap-8 overflow-x-auto xl:overflow-x-hidden'>
        <Table
          columns={skillColumns}
          data={skills}
          renderCell={renderCell}
          overflowYHidden={false}
        />
        <Suspense>
          <SkillsDialog
            open={showDialog}
            title='Delete Skill'
            description={
              <>
                Are you sure you want to delete this skill? <br />
              </>
            }
            onClose={() => toggleDialog(null)}
            onSubmit={async () => {
              await handleDelete()
            }}
            loading={loading === Loading.Pending}
          />
        </Suspense>
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
      <SkillForm open={showEditSkillForm} toggleDialog={() => handleShowEdit(null)} />
    </>
  )
}
