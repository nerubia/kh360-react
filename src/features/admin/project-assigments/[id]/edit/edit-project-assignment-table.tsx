import { useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { Button } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { setSelectedSkills, setCheckedSkills } from "@redux/slices/skills-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"

export const EditProjectAssignmentTable = () => {
  const location = useLocation()
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
    navigate(`/admin/project-assignments/select?callback=${location.pathname}`)
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
      <div className='flex-2 flex flex-col gap-5 overflow-y-scroll xl:w-2/3'>
        <div className='text-xl text-primary-500 font-bold'>Skills</div>
        <table>
          <thead className='text-left'>
            <tr>
              <th className='py-1 border-b-4 mr-2 text-primary-500 md:w-9/20'>Category</th>
              <th className='py-1 border-b-4 mr-2 text-start text-primary-500 md:w-9/20'>Name</th>
              <th className='py-1 border-b-4 mr-2 text-center text-primary-500 md:w-1/10'>
                Actions
              </th>
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
                    <div>{skill?.skill_categories?.name}</div>
                  </div>
                </td>
                <td className='py-1 border-b text-start'>
                  <div>{skill?.name}</div>
                </td>
                <td className='py-1 border-b items-center'>
                  <div className='flex gap-2 justify-center'>
                    <Button
                      testId={`DeleteButton${skill.id}`}
                      variant='unstyled'
                      onClick={() => {
                        setSelectedSkillIndex(index)
                        handleDelete()
                      }}
                    >
                      <Icon icon='Trash' size='small' />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedSkills.length === 0 ? (
          <div className='pb-4 pl-2 border-b'>
            No skills added yet. Click{" "}
            <span onClick={handleAddSkill} className='text-primary-500 cursor-pointer underline'>
              {" "}
              here
            </span>{" "}
            to add.
          </div>
        ) : (
          <div className='flex justify-start pb-10'>
            <Button onClick={handleAddSkill} variant={"ghost"}>
              <Icon icon='Plus' size='small' color='primary' />
              <p className='text-primary-500 uppercase whitespace-nowrap text-sm'>Add Skill</p>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
