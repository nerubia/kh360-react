import { useState } from "react"
import { Button } from "@components/ui/button/button"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { SkillForm } from "./skill-form/skill-form"
import { setSelectedSkillId } from "@redux/slices/skill-slice"

export const SkillsAction = () => {
  const appDispatch = useAppDispatch()
  const { skills } = useAppSelector((state) => state.skills)
  const [showAddSkillForm, setShowAddSkillForm] = useState<boolean>(false)

  const toggleDialog = () => {
    setShowAddSkillForm((prev) => !prev)
    void appDispatch(setSelectedSkillId(null))
  }

  return (
    <>
      <div className='flex flex-col items-center md:flex-row justify-between gap-4'>
        <h2 className='text-gray-400'>
          {skills.length} {skills.length === 1 ? "Result" : "Results"} Found
        </h2>
        <Button onClick={toggleDialog}>Add Skill</Button>
      </div>
      <SkillForm open={showAddSkillForm} toggleDialog={toggleDialog} />
    </>
  )
}
