import { useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { Button } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { setSelectedSkills, setCheckedSkills } from "@redux/slices/skills-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"

export const CreateProjectTable = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const location = useLocation()
  const { selectedSkills } = useAppSelector((state) => state.skills)
  const dragContent = useRef<number>(0)
  const draggedOverContent = useRef<number>(0)

  const handleDelete = (id: number) => {
    const updatedSkills = selectedSkills.filter((skill) => skill.id !== id)
    void appDispatch(setSelectedSkills(updatedSkills))
    void appDispatch(setCheckedSkills(updatedSkills))
  }

  const handleAddSkill = () => {
    navigate(`/admin/projects/create/select-skills?callback=${location.pathname}?hasEdited=true`)
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
      <div className='flex-2 flex flex-col pr-5 mb-5 overflow-y-scroll xl:w-2/3'>
        <div className='text-xl text-primary-500 font-bold pb-4'>Skills</div>
        <table>
          <thead className='text-left'>
            <tr>
              <th className='p-2 border-b-4 text-primary-500 md:w-9/20'>Category</th>
              <th className='p-2 border-b-4 text-start text-primary-500 md:w-9/20'>Name</th>
              <th className='p-2 border-b-4 text-center text-primary-500 md:w-1/10'>Actions</th>
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
                <td className='p-2 border-b'>
                  <div className='flex gap-3 items-center'>
                    <Icon icon='Menu' size='extraSmall' />
                    <div>{skill?.skill_categories.name}</div>
                  </div>
                </td>
                <td className='p-2 border-b text-start'>{skill?.name}</td>
                <td className='p-2 border-b items-center md:w-1/2'>
                  <div className='flex gap-2 justify-center'>
                    <Button
                      testId={`DeleteButton${skill.id}`}
                      variant='unstyled'
                      onClick={() => {
                        handleDelete(skill.id)
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
          <div className='pb-3 pt-2 pl-2 border-b'>
            No skills added yet. Click{" "}
            <span onClick={handleAddSkill} className='text-primary-500 cursor-pointer underline'>
              {" "}
              here
            </span>{" "}
            to add.
          </div>
        ) : (
          <div className='flex justify-start py-2'>
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
