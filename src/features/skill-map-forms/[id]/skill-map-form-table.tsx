import { useState, useEffect } from "react"
import { Button } from "@components/ui/button/button"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { CustomDialog } from "@components/ui/dialog/custom-dialog"
import { Slider } from "@components/ui/slider/slider"
import { Icon } from "@components/ui/icon/icon"
import { type OtherSkill, type Skill } from "@custom-types/skill-type"
import {
  setCheckedUserSkills,
  setSelectedUserSkills,
  setHasSelected,
} from "@redux/slices/user-skills-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { getAnswerOptionsByType } from "@redux/slices/answer-options-slice"
import { type SkillMapRating } from "@custom-types/skill-map-rating-type"
import {
  getUserSkillMapRatings,
  setOtherSkills,
  setUserSkillMapRatings,
  submitSkillMapRatings,
  updateSkillMapResultStatus,
} from "@redux/slices/user-slice"
import { setAlert } from "@redux/slices/app-slice"
import { SkillMapResultStatus } from "@custom-types/skill-map-result-type"
import { PageSubTitle } from "@components/shared/page-sub-title"
import { OtherSkillFormDialog } from "./other-skill-form/other-skill-form"
import { TextArea } from "@components/ui/textarea/text-area"
import { shortenFormatDate } from "@utils/format-date"

export const SkillMapFormTable = () => {
  const navigate = useNavigate()
  const appDispatch = useAppDispatch()
  const { id } = useParams()
  const {
    user_skill_map_ratings,
    skill_map_result_status,
    user_skill_map_admins,
    other_skills,
    comments,
  } = useAppSelector((state) => state.user)
  const { selectedUserSkills, hasSelected } = useAppSelector((state) => state.userSkills)
  const { answer_options } = useAppSelector((state) => state.answerOptions)
  const [searchParams] = useSearchParams()

  const skill_category_id = searchParams.get("skill_category_id")

  const [showSubmitDialog, setShowSubmitDialog] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showBackDialog, setShowBackDialog] = useState<boolean>(false)

  const [showOtherSkillFormDialog, setShowOtherSkillFormDialog] = useState<boolean>(false)
  const [showDeleteOtherSkillDialog, setShowDeleteOtherSkillDialog] = useState<boolean>(false)

  const [displayedSkills, setDisplayedSkills] = useState<Skill[]>([])
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [selectedOtherSkill, setSelectedOtherSkill] = useState<OtherSkill | null>(null)
  const [comment, setComment] = useState<string>("")

  useEffect(() => {
    void appDispatch(getAnswerOptionsByType("Skill Map Scale"))
  }, [])

  useEffect(() => {
    if (selectedUserSkills.length === 0) {
      const filteredSelectedUserSkills = selectedUserSkills.filter(
        (skill) => !user_skill_map_ratings.some((mapSkill) => mapSkill.id === skill.id)
      )
      if (skill_map_result_status !== SkillMapResultStatus.Submitted) {
        const skills = user_skill_map_ratings.filter(
          (userSkillMapRating) => userSkillMapRating.skill_category_id !== undefined
        )

        appDispatch(setSelectedUserSkills([...skills, ...filteredSelectedUserSkills]))
        appDispatch(setCheckedUserSkills([...skills, ...filteredSelectedUserSkills]))

        const otherSkills = user_skill_map_ratings.filter(
          (userSkillMapRating) => userSkillMapRating.skill_category_id === undefined
        )
        appDispatch(setOtherSkills(otherSkills))
      } else {
        const skills = user_skill_map_ratings.filter(
          (userSkillMapRating) => userSkillMapRating.skill_category_id !== undefined
        )
        const otherSkills = user_skill_map_ratings.filter(
          (userSkillMapRating) => userSkillMapRating.skill_category_id === undefined
        )
        appDispatch(setSelectedUserSkills([...skills]))
        appDispatch(setCheckedUserSkills([...skills]))
        appDispatch(setOtherSkills(otherSkills))
      }
    }
    setComment(comments ?? "")
  }, [user_skill_map_ratings, comments])

  useEffect(() => {
    if (skill_category_id === "all") {
      setDisplayedSkills(selectedUserSkills)
    } else {
      const filteredSkills = selectedUserSkills.filter(
        (skill) => skill.skill_categories?.id === parseInt(skill_category_id ?? "")
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

  const toggleOtherSkillFormDialog = () => {
    setShowOtherSkillFormDialog((prev) => !prev)
  }

  const toggleDeleteOtherSkillDialog = () => {
    setShowDeleteOtherSkillDialog((prev) => !prev)
  }

  const toggleSubmitDialog = () => {
    setShowSubmitDialog((prev) => !prev)
  }

  const handleSubmit = async () => {
    if (id !== undefined) {
      try {
        const skillMapRatings: SkillMapRating[] = selectedUserSkills.map((skill) => {
          return {
            id: 0,
            skill_map_administration_id: parseInt(id),
            skill_id: skill.id,
            skill_category_id: skill.skill_category_id,
            answer_option_id: skill.rating?.id,
          }
        })
        const otherSkillMapRatings: SkillMapRating[] = other_skills.map((skill) => {
          return {
            id: 0,
            skill_map_administration_id: parseInt(id),
            other_skill_name: skill.other_skill_name,
            answer_option_id: skill.rating?.id,
          }
        })

        const result = await appDispatch(
          submitSkillMapRatings({
            skill_map_ratings: [...skillMapRatings, ...otherSkillMapRatings],
            skill_map_administration_id: parseInt(id),
            comment,
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

  const handleOtherSkillSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    skill_rating_id: number
  ) => {
    const ratingValue = parseInt(e.target.value, 10)
    const rating = getSkillRating(ratingValue)

    const updatedUserSkills = other_skills.map((skill) => {
      if (skill.skill_rating_id === skill_rating_id) {
        return { ...skill, rating }
      }
      return skill
    })

    appDispatch(setOtherSkills(updatedUserSkills))
  }

  const handleOtherSkillSliderClick = (
    e: React.MouseEvent,
    rating: string | undefined,
    skill_rating_id: number
  ) => {
    const newValue = (e.currentTarget as HTMLInputElement).value
    if (rating === undefined) {
      const updatedUserSkills = other_skills.map((skill) => {
        if (skill.skill_rating_id === skill_rating_id) {
          return { ...skill, rating: getSkillRating(parseInt(newValue)) }
        }
        return skill
      })

      appDispatch(setOtherSkills(updatedUserSkills))
    }
  }

  const handleCommentInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    setComment(value)
  }

  const getSkillRating = (ratingValue: number) => {
    const answerOption = answer_options.find(
      (option) => option.display_name === ratingValue.toString()
    )

    return answerOption
  }

  return (
    <div>
      <div className='overflow-auto'>
        <table className='relative w-full z-20'>
          <thead className='text-left'>
            <tr>
              <th className='p-2 border-b-4 text-primary-500 md:w-1/4'>Skill</th>
              <th className='p-2 border-b-4 text-primary-500 md:w-1/4'>Category</th>
              <th className='p-2 border-b-4 text-start text-primary-500 md:w-1/5'>
                Previous Rating
              </th>
              <th className='p-2 border-b-4 text-center text-primary-500 md:w-1/3'>
                Rating
                <div className='flex justify-between font-normal text-sm mt-2'>
                  {answer_options.map((option, index) => (
                    <p key={index}>{option.display_name}</p>
                  ))}
                </div>
              </th>
              <th className='px-10 border-b-4 text-center text-primary-500 md:w-1/4'></th>
            </tr>
          </thead>
          <tbody>
            {displayedSkills.map((skill, index) => (
              <tr key={index} className='hover:bg-slate-100'>
                <td className='p-2 border-b'>
                  <div>{skill?.name}</div>
                </td>
                <td className='p-2 border-b text-start'>{skill?.skill_categories?.name}</td>
                <td className='p-2 border-b text-start'>
                  <div className='flex items-center gap-1'>
                    {skill?.previous_rating?.display_name ?? "No Rating"}
                    {skill.previous_submitted_date !== undefined && (
                      <span className='text-xs'>
                        (as of {shortenFormatDate(skill.previous_submitted_date)})
                      </span>
                    )}
                  </div>
                </td>
                <td className='p-2 border-b text-start'>
                  <Slider
                    sliderValue={parseInt(skill.rating?.display_name ?? "0")}
                    variant={skill.rating?.display_name === undefined ? "empty" : "primary"}
                    handleSliderChange={(e) => handleSliderChange(e, skill.id)}
                    onClick={(e) => handleSliderClick(e, skill.rating?.display_name, skill.id)}
                    disabled={
                      skill_map_result_status === SkillMapResultStatus.Submitted ||
                      skill_map_result_status === SkillMapResultStatus.Closed
                    }
                  />
                </td>
                <td className='p-2 border-b items-center '>
                  {skill_map_result_status !== SkillMapResultStatus.Submitted &&
                    skill_map_result_status !== SkillMapResultStatus.Closed && (
                      <div className='flex gap-2 justify-center'>
                        <Button
                          testId={`DeleteButton${skill.id}`}
                          variant='unstyled'
                          onClick={async () => {
                            setSelectedSkill(skill)
                            toggleDeleteDialog()
                          }}
                          disabled={
                            skill_map_result_status === SkillMapResultStatus.Submitted ||
                            skill_map_result_status === SkillMapResultStatus.Closed
                          }
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
        {skill_map_result_status !== SkillMapResultStatus.Submitted &&
          skill_map_result_status !== SkillMapResultStatus.Closed && (
            <div className='mt-4'>
              <Button onClick={handleAddSkill} variant={"ghost"}>
                <Icon icon='Plus' size='small' color='primary' />
                <p className='text-primary-500 uppercase whitespace-nowrap text-sm'>
                  Add New Skills
                </p>
              </Button>
            </div>
          )}
      </div>
      <div className='mt-20'>
        <PageSubTitle>Other Skills</PageSubTitle>
      </div>
      <div className='overflow-auto'>
        <table className='relative w-full z-20'>
          <thead className='text-left'>
            <tr>
              <th className='p-2 border-b-4 text-primary-500 md:w-1/4'>Skill</th>
              <th className='p-2 border-b-4 text-center text-primary-500 md:w-1/3'>
                Rating
                <div className='flex justify-between font-normal text-sm mt-2'>
                  {answer_options.map((option, index) => (
                    <p key={index}>{option.display_name}</p>
                  ))}
                </div>
              </th>
              <th className='px-10 border-b-4 text-center text-primary-500 md:w-1/4'></th>
            </tr>
          </thead>
          <tbody>
            {other_skills.map((skill, index) => (
              <tr key={index} className='hover:bg-slate-100'>
                <td className='p-2 border-b'>
                  <div>{skill?.other_skill_name}</div>
                </td>
                <td className='p-2 border-b text-start'>
                  <Slider
                    sliderValue={parseInt(skill.rating?.display_name ?? "0")}
                    variant={skill.rating?.display_name === undefined ? "empty" : "primary"}
                    handleSliderChange={(e) =>
                      handleOtherSkillSliderChange(e, skill.skill_rating_id)
                    }
                    onClick={(e) =>
                      handleOtherSkillSliderClick(
                        e,
                        skill.rating?.display_name,
                        skill.skill_rating_id
                      )
                    }
                    disabled={
                      skill_map_result_status === SkillMapResultStatus.Submitted ||
                      skill_map_result_status === SkillMapResultStatus.Closed
                    }
                  />
                </td>
                <td className='p-2 border-b items-center '>
                  {skill_map_result_status !== SkillMapResultStatus.Submitted &&
                    skill_map_result_status !== SkillMapResultStatus.Closed && (
                      <div className='flex gap-2 justify-center'>
                        <Button
                          testId={`DeleteButton${skill.skill_rating_id}`}
                          variant='unstyled'
                          onClick={async () => {
                            setSelectedOtherSkill(skill)
                            toggleDeleteOtherSkillDialog()
                          }}
                          disabled={
                            skill_map_result_status === SkillMapResultStatus.Submitted ||
                            skill_map_result_status === SkillMapResultStatus.Closed
                          }
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
        {skill_map_result_status !== SkillMapResultStatus.Submitted &&
          skill_map_result_status !== SkillMapResultStatus.Closed && (
            <div className='mt-4'>
              <Button onClick={toggleOtherSkillFormDialog} variant={"ghost"}>
                <Icon icon='Plus' size='small' color='primary' />
                <p className='text-primary-500 uppercase whitespace-nowrap text-sm'>
                  Add Other Skills
                </p>
              </Button>
            </div>
          )}
        <div className='mt-20'>
          <PageSubTitle>Comments</PageSubTitle>
          {skill_map_result_status === SkillMapResultStatus.Submitted ||
          skill_map_result_status === SkillMapResultStatus.Closed ? (
            <pre className='flex font-sans break-words whitespace-pre-wrap italic mt-2'>
              {comment.length > 0 ? comment : "No comments"}
            </pre>
          ) : (
            <TextArea
              name='comment'
              placeholder='Comments'
              value={comment}
              onChange={handleCommentInputChange}
              maxLength={500}
              disabled={
                skill_map_result_status === SkillMapResultStatus.Submitted ||
                skill_map_result_status === SkillMapResultStatus.Closed
              }
            />
          )}
        </div>
      </div>

      <div className='flex justify-between mt-4 pb-4'>
        <Button
          variant='primaryOutline'
          onClick={() =>
            skill_map_result_status === SkillMapResultStatus.Submitted ||
            skill_map_result_status === SkillMapResultStatus.Closed
              ? handleRedirect()
              : toggleBackDialog()
          }
        >
          {skill_map_result_status === SkillMapResultStatus.Submitted ||
          skill_map_result_status === SkillMapResultStatus.Closed
            ? "Back to List"
            : "Cancel & Exit"}
        </Button>
        <Button
          variant='primary'
          onClick={toggleSubmitDialog}
          disabled={
            skill_map_result_status === SkillMapResultStatus.Submitted ||
            skill_map_result_status === SkillMapResultStatus.Closed
          }
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
      <OtherSkillFormDialog
        open={showOtherSkillFormDialog}
        toggleDialog={toggleOtherSkillFormDialog}
      />
      <CustomDialog
        open={showDeleteOtherSkillDialog}
        title='Delete Other Skill'
        description={`Are you sure you want to delete ${selectedOtherSkill?.other_skill_name}?`}
        onClose={toggleDeleteOtherSkillDialog}
        onSubmit={async () => {
          toggleDeleteOtherSkillDialog()
          if (selectedOtherSkill !== null) {
            const filteredUserSkills = other_skills.filter(
              (skill) => skill.skill_rating_id !== selectedOtherSkill.skill_rating_id
            )
            void appDispatch(setOtherSkills(filteredUserSkills))
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
