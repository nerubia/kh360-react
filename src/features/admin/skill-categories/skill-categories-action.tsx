import { useState } from "react"
import { Button } from "@components/ui/button/button"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { SkillCategoriesForm } from "@features/admin/skill-categories/create/skill-categories-form"
import { setSelectedSkillCategoryId } from "@redux/slices/skill-category-slice"

export const SkillCategoriesAction = () => {
  const appDispatch = useAppDispatch()
  const { skill_categories } = useAppSelector((state) => state.skillCategories)
  const [showAddCategoryForm, setShowAddCategoryForm] = useState<boolean>(false)

  const toggleDialog = () => {
    setShowAddCategoryForm((prev) => !prev)
    void appDispatch(setSelectedSkillCategoryId(null))
  }

  return (
    <>
      <div className='flex flex-col items-center md:flex-row justify-between gap-4'>
        <h2 className='text-gray-400'>
          {skill_categories.length} {skill_categories.length === 1 ? "Result" : "Results"} Found
        </h2>
        <Button onClick={toggleDialog}>Add Skill Category</Button>
      </div>
      <SkillCategoriesForm open={showAddCategoryForm} toggleDialog={toggleDialog} />
    </>
  )
}
