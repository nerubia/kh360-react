import { useState, useEffect } from "react"
import { Button } from "@components/ui/button/button"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"
import { Slider } from "@components/ui/slider/slider"
import { Icon } from "@components/ui/icon/icon"
import { type Skill, SkillMapRating } from "@custom-types/skill-type"
import { setCheckedUserSkills, setSelectedUserSkills } from "@redux/slices/user-skills-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"

export const SkillMapFormTable = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { selectedUserSkills } = useAppSelector((state) => state.userSkills)
  const [searchParams] = useSearchParams()

  const skill_category_id = searchParams.get("skill_category_id")

  const [showSubmitDialog, setShowSubmitDialog] = useState<boolean>(false)
  const [showBackDialog, setShowBackDialog] = useState<boolean>(false)

  const [displayedSkills, setDisplayedSkills] = useState<Skill[]>([])

  useEffect(() => {
    // Hard coded data for now
    const user_skill_map_skills: Skill[] = [
      {
        id: 1,
        name: "Adobe Flex",
        skill_category_id: 1,
        description: "Desc",
        sequence_no: 1,
        status: true,
        skill_categories: {
          id: 1,
          name: "Programming Languages",
          sequence_no: 1,
          description: "Desc",
          status: true,
        },
        previous_rating: "Beginner",
        rating: "Beginner",
      },
      {
        id: 2,
        name: "Action Script",
        skill_category_id: 1,
        description: "Desc",
        sequence_no: 2,
        status: true,
        skill_categories: {
          id: 1,
          name: "Programming Languages",
          sequence_no: 1,
          description: "Desc",
          status: true,
        },
        previous_rating: "Intermediate",
        rating: "Intermediate",
      },
    ]

    const filteredSelectedUserSkills = selectedUserSkills.filter(
      (skill) => !user_skill_map_skills.some((mapSkill) => mapSkill.id === skill.id)
    )

    appDispatch(setSelectedUserSkills([...user_skill_map_skills, ...filteredSelectedUserSkills]))
    appDispatch(setCheckedUserSkills([...user_skill_map_skills, ...filteredSelectedUserSkills]))
  }, [])

  useEffect(() => {
    if (skill_category_id === "all") {
      setDisplayedSkills(selectedUserSkills)
    } else {
      const filteredSkills = selectedUserSkills.filter(
        (skill) => skill.skill_categories.id === parseInt(skill_category_id ?? "")
      )
      setDisplayedSkills(filteredSkills)
    }
  }, [selectedUserSkills, skill_category_id])

  const handleRedirect = () => {
    navigate("/skill-map-forms")
  }

  const toggleBackDialog = () => {
    setShowBackDialog((prev) => !prev)
  }

  const toggleSubmitDialog = () => {
    setShowSubmitDialog((prev) => !prev)
  }

  const handleSubmit = async () => {
    // Console log submit for now
    // Please REMOVE this log when integrating API
    /* eslint-disable */
    console.log(
      "Pass this when submitting (REMOVE this when integrating API): ",
      selectedUserSkills
    )
  }

  const handleDelete = async (id: number) => {
    const filteredUserSkills = selectedUserSkills.filter((skill) => skill.id !== id)
    appDispatch(setSelectedUserSkills(filteredUserSkills))
    appDispatch(setCheckedUserSkills(filteredUserSkills))
  }

  const handleAddSkill = () => {
    navigate("add")
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const ratingValue = parseInt(e.target.value, 10)
    const rating = getSkillRating(ratingValue)

    const updatedUserSkills = selectedUserSkills.map((skill) => {
      if (skill.id === id) {
        return { ...skill, rating }
      }
      return skill
    })

    appDispatch(setSelectedUserSkills(updatedUserSkills))
    appDispatch(setCheckedUserSkills(updatedUserSkills))
  }

  const handleSliderClick = (e: React.MouseEvent, rating: string | undefined, id: number) => {
    const newValue = (e.currentTarget as HTMLInputElement).value
    if (rating === undefined) {
      const updatedUserSkills = selectedUserSkills.map((skill) => {
        if (skill.id === id) {
          return { ...skill, rating: getSkillRating(parseInt(newValue)) }
        }
        return skill
      })

      appDispatch(setSelectedUserSkills(updatedUserSkills))
      appDispatch(setCheckedUserSkills(updatedUserSkills))
    }
  }

  const getSkillRating = (ratingValue: number) => {
    if (ratingValue === SkillMapRating.Beginner) {
      return "Beginner"
    } else if (ratingValue === SkillMapRating.Intermediate) {
      return "Intermediate"
    } else if (ratingValue === SkillMapRating.Expert) {
      return "Expert"
    } else {
      return ""
    }
  }

  const getSkillRatingValue = (rating: string) => {
    switch (rating) {
      case "Beginner":
        return SkillMapRating.Beginner
      case "Intermediate":
        return SkillMapRating.Intermediate
      case "Expert":
        return SkillMapRating.Expert
      default:
        return undefined
    }
  }

  return (
    <div>
      <div className='h-full'>
        <table className='relative w-full z-20'>
          <thead className='text-left'>
            <tr>
              <th className='py-1 border-b-4 mr-2 text-primary-500 md:w-1/4'>Skill</th>
              <th className='py-1 border-b-4 mr-2 text-primary-500 md:w-1/4'>Category</th>
              <th className='py-1 border-b-4 mr-2 text-start text-primary-500 md:w-1/5'>
                Previous Rating
              </th>
              <th className='py-1 border-b-4 mr-2 text-center text-primary-500 md:w-1/3'>
                Rating
                <div className='flex justify-between font-normal text-sm mt-2'>
                  <p>Beginner</p>
                  <p>Intermediate</p>
                  <p>Expert</p>
                </div>
              </th>
              <th className='px-10 border-b-4 mr-2 text-center text-primary-500 md:w-1/4'></th>
            </tr>
          </thead>
          <tbody>
            {displayedSkills.map((skill, index) => (
              <tr key={index} className='hover:bg-slate-100'>
                <td className='py-1 border-b'>
                  <div>{skill?.name}</div>
                </td>
                <td className='py-1 border-b text-start'>{skill?.skill_categories.name}</td>
                <td className='py-1 border-b text-start'>{skill?.previous_rating}</td>
                <td className='py-1 border-b text-start'>
                  <Slider
                    sliderValue={getSkillRatingValue(skill.rating) ?? 0}
                    variant={getSkillRatingValue(skill.rating) === undefined ? "empty" : "primary"}
                    handleSliderChange={(e) => handleSliderChange(e, skill.id)}
                    onClick={(e) => handleSliderClick(e, skill.rating, skill.id)}
                  />
                </td>
                <td className='py-1 border-b items-center '>
                  <div className='flex gap-2 justify-center'>
                    <Button
                      testId={`DeleteButton${skill.id}`}
                      variant='unstyled'
                      onClick={async () => {
                        await handleDelete(skill.id)
                      }}
                    >
                      <Icon icon='Trash' size='extraSmall' color='gray' />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='mt-4'>
          <Button onClick={handleAddSkill} variant={"ghost"}>
            <Icon icon='Plus' size='small' color='primary' />
            <p className='text-primary-500 uppercase whitespace-nowrap text-sm'>Add New Skills</p>
          </Button>
        </div>
      </div>
      <div className='flex justify-between mt-5 pb-4'>
        <Button variant='primaryOutline' onClick={() => toggleBackDialog()}>
          {"Cancel & Exit"}
        </Button>
        <Button variant='primary' onClick={toggleSubmitDialog}>
          Save & Submit
        </Button>
      </div>
      <CustomDialog
        open={showBackDialog}
        title={"Cancel & Exit"}
        description={
          <>
            Are you sure you want to cancel and exit? <br />
            If you do, your data won&apos;t be saved.
          </>
        }
        onClose={toggleBackDialog}
        onSubmit={handleRedirect}
      />
      <CustomDialog
        open={showSubmitDialog}
        title='Submit Skill Map'
        description='Are you sure you want to submit your answers?'
        onClose={toggleSubmitDialog}
        onSubmit={async () => {
          toggleSubmitDialog()
          await handleSubmit()
        }}
      />
    </div>
  )
}
