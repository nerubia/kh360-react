import { useState, useEffect } from "react"
import { Button } from "@components/ui/button/button"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"
import { Slider } from "@components/ui/slider/slider"
import { Icon } from "@components/ui/icon/icon"
import { type Skill } from "@custom-types/skill-type"
import {
  setCheckedUserSkills,
  setSelectedUserSkills,
  setHasSelected,
} from "@redux/slices/user-skills-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { getAnswerOptionsByType } from "@redux/slices/answer-options-slice"
import { type SkillMapRating, RatingAnswerOption } from "@custom-types/skill-map-rating-type"
import {
  getUserSkillMapRatings,
  setUserSkillMapRatings,
  submitSkillMapRatings,
  updateSkillMapResultStatus,
} from "@redux/slices/user-slice"
import { setAlert } from "@redux/slices/app-slice"
import { SkillMapResultStatus } from "@custom-types/skill-map-result-type"

export const SkillMapFormTable = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { id } = useParams()
  const { user_skill_map_ratings, skill_map_result_status, user_skill_map_admins } = useAppSelector(
    (state) => state.user
  )
  const { selectedUserSkills, hasSelected } = useAppSelector((state) => state.userSkills)
  const { answer_options } = useAppSelector((state) => state.answerOptions)
  const [searchParams] = useSearchParams()

  const skill_category_id = searchParams.get("skill_category_id")

  const [showSubmitDialog, setShowSubmitDialog] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showBackDialog, setShowBackDialog] = useState<boolean>(false)

  const [displayedSkills, setDisplayedSkills] = useState<Skill[]>([])
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  useEffect(() => {
    void appDispatch(getAnswerOptionsByType("Skill Map Scale"))
  }, [])

  useEffect(() => {
    if (selectedUserSkills.length === 0) {
      const filteredSelectedUserSkills = selectedUserSkills.filter(
        (skill) => !user_skill_map_ratings.some((mapSkill) => mapSkill.id === skill.id)
      )
      if (skill_map_result_status !== SkillMapResultStatus.Submitted) {
        appDispatch(
          setSelectedUserSkills([...user_skill_map_ratings, ...filteredSelectedUserSkills])
        )
        appDispatch(
          setCheckedUserSkills([...user_skill_map_ratings, ...filteredSelectedUserSkills])
        )
      } else {
        appDispatch(setSelectedUserSkills([...user_skill_map_ratings]))
        appDispatch(setCheckedUserSkills([...user_skill_map_ratings]))
      }
    }
  }, [user_skill_map_ratings])

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

  useEffect(() => {
    if (user_skill_map_ratings.length === 0 && !hasSelected) {
      appDispatch(setSelectedUserSkills([]))
      appDispatch(setCheckedUserSkills([]))
      appDispatch(setHasSelected(false))
    }
  }, [user_skill_map_ratings])

  const handleRedirect = () => {
    appDispatch(setUserSkillMapRatings([]))
    appDispatch(setSelectedUserSkills([]))
    appDispatch(setCheckedUserSkills([]))
    appDispatch(setHasSelected(false))
    navigate("/skill-map-forms")
  }

  const toggleBackDialog = () => {
    appDispatch(setSelectedUserSkills([]))
    appDispatch(setCheckedUserSkills([]))
    appDispatch(setHasSelected(false))
    setShowBackDialog((prev) => !prev)
  }

  const toggleDeleteDialog = () => {
    setShowDeleteDialog((prev) => !prev)
  }

  const toggleSubmitDialog = () => {
    setShowSubmitDialog((prev) => !prev)
  }

  const handleSubmit = async () => {
    if (id !== undefined) {
      try {
        const skillMapRatings: SkillMapRating[] = selectedUserSkills.map((skill) => {
          return {
            skill_map_administration_id: parseInt(id),
            skill_id: skill.id,
            skill_category_id: skill.skill_category_id,
            answer_option_id: skill.rating?.id,
          }
        })
        const result = await appDispatch(
          submitSkillMapRatings({
            skill_map_ratings: skillMapRatings,
            skill_map_administration_id: parseInt(id),
          })
        )

        if (result.type === "user/submitSkillMapRatings/fulfilled") {
          appDispatch(
            setAlert({
              description: "Successfully submitted skill map ratings",
              variant: "success",
            })
          )
          appDispatch(updateSkillMapResultStatus(SkillMapResultStatus.Submitted))
          void appDispatch(getUserSkillMapRatings(user_skill_map_admins[0].id))
        }
        if (result.type === "user/submitSkillMapRatings/rejected") {
          appDispatch(
            setAlert({
              description: result.payload,
              variant: "destructive",
            })
          )
        }
      } catch (error) {}
    }
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
    let ratingName = ""
    if (ratingValue === RatingAnswerOption.Beginner) {
      ratingName = "Beginner"
    } else if (ratingValue === RatingAnswerOption.Intermediate) {
      ratingName = "Intermediate"
    } else if (ratingValue === RatingAnswerOption.Expert) {
      ratingName = "Expert"
    }

    const answerOption = answer_options.find((option) => option.display_name === ratingName)

    return answerOption
  }

  const getSkillRatingValue = (rating: string) => {
    switch (rating) {
      case "Beginner":
        return RatingAnswerOption.Beginner
      case "Intermediate":
        return RatingAnswerOption.Intermediate
      case "Expert":
        return RatingAnswerOption.Expert
      default:
        return undefined
    }
  }

  return (
    <div>
      <div className='h-full overflow-auto'>
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
                  {answer_options.map((option, index) => (
                    <p key={index}>{option.display_name}</p>
                  ))}
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
                <td className='py-1 border-b text-start'>
                  {skill?.previous_rating?.display_name ?? "No Rating"}
                </td>
                <td className='py-1 border-b text-start'>
                  <Slider
                    sliderValue={getSkillRatingValue(skill.rating?.display_name ?? "") ?? 0}
                    variant={
                      getSkillRatingValue(skill.rating?.display_name ?? "") === undefined
                        ? "empty"
                        : "primary"
                    }
                    handleSliderChange={(e) => handleSliderChange(e, skill.id)}
                    onClick={(e) => handleSliderClick(e, skill.rating?.display_name, skill.id)}
                    disabled={skill_map_result_status === SkillMapResultStatus.Submitted}
                  />
                </td>
                <td className='py-1 border-b items-center '>
                  {skill_map_result_status !== SkillMapResultStatus.Submitted && (
                    <div className='flex gap-2 justify-center'>
                      <Button
                        testId={`DeleteButton${skill.id}`}
                        variant='unstyled'
                        onClick={async () => {
                          setSelectedSkill(skill)
                          toggleDeleteDialog()
                        }}
                        disabled={skill_map_result_status === SkillMapResultStatus.Submitted}
                      >
                        <Icon icon='Trash' size='extraSmall' color='gray' />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {skill_map_result_status !== SkillMapResultStatus.Submitted && (
          <div className='mt-4'>
            <Button onClick={handleAddSkill} variant={"ghost"}>
              <Icon icon='Plus' size='small' color='primary' />
              <p className='text-primary-500 uppercase whitespace-nowrap text-sm'>Add New Skills</p>
            </Button>
          </div>
        )}
      </div>
      <div className='flex justify-between mt-5 pb-4'>
        <Button
          variant='primaryOutline'
          onClick={() =>
            skill_map_result_status === SkillMapResultStatus.Submitted
              ? handleRedirect()
              : toggleBackDialog()
          }
        >
          {skill_map_result_status === SkillMapResultStatus.Submitted
            ? "Back to List"
            : "Cancel & Exit"}
        </Button>
        <Button
          variant='primary'
          onClick={toggleSubmitDialog}
          disabled={skill_map_result_status === SkillMapResultStatus.Submitted}
        >
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
        open={showDeleteDialog}
        title='Delete Skill'
        description={`Are you sure you want to delete ${selectedSkill?.name}?`}
        onClose={toggleDeleteDialog}
        onSubmit={async () => {
          toggleDeleteDialog()
          if (selectedSkill !== null) {
            await handleDelete(selectedSkill.id)
          }
        }}
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
