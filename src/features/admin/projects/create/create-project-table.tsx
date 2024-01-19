import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { Button } from "../../../../components/ui/button/button"
import { Icon } from "../../../../components/ui/icon/icon"
import { setSelectedSkills, setCheckedSkills } from "../../../../redux/slices/skills-slice"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"

export const CreateProjectTable = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { selectedSkills } = useAppSelector((state) => state.skills)
  const [selectedSkillIndex, setSelectedSkillIndex] = useState<number>(0)
  const dragContent = useRef<number>(0)
  const draggedOverContent = useRef<number>(0)

  const handleDelete = () => {
    const updatedSkills = selectedSkills.filter((_, index) => index !== selectedSkillIndex)
    void appDispatch(setSelectedSkills(updatedSkills))
    void appDispatch(setCheckedSkills(updatedSkills))
  }

  const handleAddSkill = () => {
    navigate("/admin/projects/create/select-skills")
  }

  const handleSort = () => {
    const selectedSkillsData = [...selectedSkills]
    const draggedItem = selectedSkillsData[dragContent.current]

    selectedSkillsData.splice(dragContent.current, 1)
    selectedSkillsData.splice(draggedOverContent.current, 0, draggedItem)

    void appDispatch(setSelectedSkills(selectedSkillsData))
    void appDispatch(setCheckedSkills(selectedSkillsData))
  }

  return (
    <>
      <div className='flex-2 flex flex-col gap-5 overflow-y-scroll'>
        <div className='text-xl text-primary-500 font-bold'>Skills</div>
        <table>
          <thead className='text-left'>
            <tr>
              <th className='py-1 border-b-4 mr-2 text-primary-500 md:w-1/4'>Category</th>
              <th className='py-1 border-b-4 mr-2 text-start text-primary-500 md:w-1/2'>Name</th>
              <th className='py-1 border-b-4 mr-2 text-start text-primary-500 md:w-1/2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectedSkills.map((skill, index) => (
              <tr
                key={index}
                className='hover:bg-slate-100 cursor-grab'
                draggable
                onDragStart={() => {
                  dragContent.current = index
                }}
                onDragEnter={() => (draggedOverContent.current = index)}
                onDragEnd={() => {
                  handleSort()
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <td className='py-1 border-b'>
                  <div className='flex gap-3 items-center'>
                    <Icon icon='Menu' size='extraSmall' />
                    <div>{skill?.name}</div>
                  </div>
                </td>
                <td className='py-1 border-b text-start'>{skill?.skill_categories.name}</td>
                <td className='py-1 border-b text-center items-center md:w-1/2'>
                  <div className='flex gap-2 '>
                    <Button
                      testId={`DeleteButton${skill.id}`}
                      variant='unstyled'
                      onClick={() => {
                        setSelectedSkillIndex(index)
                        handleDelete()
                      }}
                    >
                      <Icon icon='Trash' />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex justify-end'>
          <Button onClick={handleAddSkill}>Add Skill</Button>
        </div>
      </div>
    </>
  )
}