import { useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { useEffect, useState, useRef, lazy, Suspense } from "react"
import { Button } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { Badge } from "@components/ui/badge/badge"
import { Table } from "@components/ui/table/table"
import {
  getSkillCategories,
  setSkillCategories,
  sortSkillCategories,
} from "@redux/slices/skill-categories-slice"
import { setSelectedSkillCategoryId, deleteSkillCategory } from "@redux/slices/skill-category-slice"
import { type SkillCategory, skillCategoryColumns } from "@custom-types/skill-category-type"
import { SkillCategoriesForm } from "./create/skill-categories-form"
import { setAlert } from "@redux/slices/app-slice"
import { Loading } from "@custom-types/loadingType"

export const SkillCategoriesTable = () => {
  const [searchParams] = useSearchParams()
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const appDispatch = useAppDispatch()
  const { loading_sort, skill_categories } = useAppSelector((state) => state.skillCategories)
  const { selectedSkillCategoryId } = useAppSelector((state) => state.skillCategory)
  const SkillCategoriesDialog = lazy(
    async () => await import("@features/admin/skill-categories/skill-categories-dialog")
  )
  const [showEditCategoryForm, setShowEditCategoryForm] = useState<boolean>(false)
  const [isDraggable, setIsDraggable] = useState<boolean>(false)

  const dragContent = useRef<number>(0)
  const draggedOverContent = useRef<number>(0)

  useEffect(() => {
    void appDispatch(
      getSkillCategories({
        name: searchParams.get("name") ?? undefined,
        status: searchParams.get("status") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )

    if (searchParams.size > 0) {
      setIsDraggable(false)
    } else {
      setIsDraggable(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (loading_sort === Loading.Pending) {
      setIsDraggable(false)
    }

    if (loading_sort === Loading.Fulfilled) {
      setIsDraggable(true)
    }
  }, [loading_sort])

  const handleShowEdit = (id: number | null) => {
    if (id !== null) {
      void appDispatch(setSelectedSkillCategoryId(id))
    }
    setShowEditCategoryForm((prev) => !prev)
  }

  const handleDelete = async () => {
    if (selectedSkillCategoryId !== null) {
      try {
        const result = await appDispatch(deleteSkillCategory(selectedSkillCategoryId))
        if (result.type === "skillCategory/deleteSkillCategory/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
          toggleDialog(null)
        }
        if (result.type === "skillCategory/deleteSkillCategory/fulfilled") {
          appDispatch(
            setAlert({
              description: "Skill category deleted successfully",
              variant: "success",
            })
          )
          const updatedData = skill_categories.filter(
            (project) => project.id !== parseInt(result.payload.id)
          )
          void appDispatch(setSkillCategories(updatedData))
          toggleDialog(null)
        }
      } catch (err) {}
    }
  }

  const handleSort = async () => {
    const dataCopy = skill_categories.map((item) => ({ ...item }))
    const draggedItem = dataCopy[dragContent.current]

    dataCopy.splice(dragContent.current, 1)
    dataCopy.splice(draggedOverContent.current, 0, draggedItem)

    const toUpdateSequenceNumbers = dataCopy.map((data, index) => ({
      id: data.id,
      sequence_no: index + 1,
    }))

    await appDispatch(sortSkillCategories({ skillCategories: toUpdateSequenceNumbers }))
    appDispatch(setSkillCategories(dataCopy))
  }

  const toggleDialog = (id: number | null) => {
    if (id !== null) {
      void appDispatch(setSelectedSkillCategoryId(id))
    }
    setShowDialog((prev) => !prev)
  }

  const renderCell = (item: SkillCategory, column: unknown) => {
    switch (column) {
      case "Name":
        return (
          <div className='flex gap-2 items-center'>
            <Icon icon='Menu' size='extraSmall' />
            {item.name ?? ""}
          </div>
        )
      case "Description":
        return <div className='max-w-[800px]'>{item.description ?? ""}</div>
      case "Status":
        return (
          <Badge variant={`${item.status === true ? "green" : "gray"}`} size='small'>
            {item.status === true ? "ACTIVE" : "INACTIVE"}
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
          columns={skillCategoryColumns}
          data={skill_categories}
          renderCell={renderCell}
          overflowYHidden={false}
          isRowDraggable={isDraggable}
          handleSort={isDraggable ? async () => await handleSort() : undefined}
          dragContent={isDraggable ? dragContent : undefined}
          draggedOverContent={isDraggable ? draggedOverContent : undefined}
          customWidth='max-w-[800px]'
          applyFixedColWidth
        />
        <Suspense>
          <SkillCategoriesDialog
            open={showDialog}
            title='Delete Skill Category'
            description={
              <>
                Are you sure you want to delete this skill category? <br />
              </>
            }
            onClose={() => toggleDialog(null)}
            onSubmit={async () => {
              await handleDelete()
            }}
          />
        </Suspense>
      </div>
      <SkillCategoriesForm open={showEditCategoryForm} toggleDialog={() => handleShowEdit(null)} />
    </>
  )
}
