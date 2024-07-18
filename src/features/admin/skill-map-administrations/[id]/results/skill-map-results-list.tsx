import { Suspense, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "@hooks/useAppSelector"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useMobileView } from "@hooks/use-mobile-view"
import {
  getSkillMapAdminResults,
  getSkillMapResultsAll,
} from "@redux/slices/skill-map-results-slice"
import { Icon } from "@components/ui/icon/icon"
import { PageSubTitle } from "@components/shared/page-sub-title"
import { type SkillMapResult, type CustomUserSkillMap } from "@custom-types/skill-map-result-type"
import { Badge } from "@components/ui/badge/badge"
import { getSkillMapResultStatusVariant } from "@utils/variant"
import { Loading } from "@custom-types/loadingType"
import { Skeleton } from "@components/ui/skeleton/Skeleton"

export const SkillMapResultList = () => {
  const appDispatch = useAppDispatch()
  const { id } = useParams()
  const { loading, comments, skill_map_results, skill_map_admin_results } = useAppSelector(
    (state) => state.skillMapResults
  )
  const isMobile = useMobileView(1028)
  const [skillMapResultToggledState, setSkillMapResultToggledState] = useState<boolean[]>([])

  const [userSkillMapResults, setUserSkillMapResults] = useState<CustomUserSkillMap[]>([])
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (selectedUserId !== null) {
      if (
        userSkillMapResults.find(
          (userSkillMapResult) => userSkillMapResult.user_id === selectedUserId
        ) == null
      ) {
        setUserSkillMapResults((prev) => [
          ...prev,
          {
            user_id: selectedUserId,
            skill_map_results: skill_map_admin_results,
            comments,
          },
        ])
      }
    }
  }, [skill_map_admin_results])

  useEffect(() => {
    if (id !== undefined) {
      void appDispatch(
        getSkillMapResultsAll({
          skill_map_administration_id: id,
        })
      )
        .then((res) => {
          setSkillMapResultToggledState(() => [...new Array(res.payload.length).fill(false)])
        })
        .finally(() => {
          setIsLoaded(true)
        })
    }
  }, [])

  const toggleSkillMapResult = (index: number, user_id: number | undefined) => {
    const updateToggleState: boolean[] = [...skillMapResultToggledState]
    updateToggleState[index] = !updateToggleState[index]
    setSkillMapResultToggledState(updateToggleState)
    if (id !== undefined && user_id !== undefined) {
      void appDispatch(
        getSkillMapAdminResults({ skill_map_administration_id: parseInt(id), userId: user_id })
      )
      setSelectedUserId(user_id)
    }
  }

  const skillsTable = (skillMapResult: SkillMapResult) => {
    const customSkillMapResults =
      userSkillMapResults
        .find((userSkillMapResult) => userSkillMapResult.user_id === skillMapResult.users?.id)
        ?.skill_map_results.filter(
          (skillMapResult) => skillMapResult.skill_category_id !== undefined
        ) ?? []

    if (customSkillMapResults.length === 0) {
      return loading !== Loading.Pending && <div className='text-sm'>- No Skills added.</div>
    }

    return (
      <table className={`md:w-full md:table-fixed text-sm mb-2`}>
        <thead className='sticky top-0 bg-white text-left'>
          <tr>
            <th className='md:w-170 p-1'>Skill</th>
            <th className='md:w-150 p-1'>Category</th>
            <th className='md:w-150 p-1'>Previous Rating</th>
            <th className='md:w-150 p-1'>Rating</th>
          </tr>
        </thead>
        <tbody>
          {customSkillMapResults.map((rating, ratingIndex) => (
            <tr key={ratingIndex} className='sm:overflow-x-auto'>
              <td className='min-w-196 p-1'>{rating.name}</td>
              <td className='min-w-196 p-1'>{rating.skill_categories?.name}</td>
              <td className='min-w-196 p-1'>
                {rating.previous_rating === null ? "No Rating" : rating.previous_rating?.name}
              </td>
              <td className='min-w-196 p-1'>{rating.rating?.display_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const otherSkillsTable = (skillMapResult: SkillMapResult) => {
    const customSkillMapResults =
      userSkillMapResults
        .find((userSkillMapResult) => userSkillMapResult.user_id === skillMapResult.users?.id)
        ?.skill_map_results.filter(
          (skillMapResult) => skillMapResult.skill_category_id === undefined
        ) ?? []

    if (customSkillMapResults.length === 0) {
      return loading !== Loading.Pending && <div className='text-sm'>- No other skills added.</div>
    }

    return (
      <table className={`md:w-full md:table-fixed text-sm mb-2`}>
        <thead className='sticky top-0 bg-white text-left'>
          <tr>
            <th className='md:w-170 p-1'>Skill</th>
            <th className='md:w-150 p-1'>Rating</th>
          </tr>
        </thead>
        <tbody>
          {customSkillMapResults.map((rating, ratingIndex) => (
            <tr key={ratingIndex} className='sm:overflow-x-auto'>
              <td className='min-w-196 p-1'>{rating.other_skill_name}</td>
              <td className='min-w-196 p1'>{rating.rating?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const getComment = (skillMapResult: SkillMapResult) => {
    const comment = userSkillMapResults.find(
      (userSkillMapResult) => userSkillMapResult.user_id === skillMapResult.users?.id
    )?.comments
    if (comment === null || comment === undefined || comment.length === 0) {
      return loading !== Loading.Pending && "- No comments added"
    }
    return comment
  }

  return (
    <>
      <div className={`flex flex-col gap-8 mb-4`}>
        <div className={`flex flex-col ${isMobile ? "overflow-x-auto" : ""}`}>
          {isLoaded &&
            skill_map_results?.map((skillMapResult, skillMapIndex) => (
              <div key={skillMapIndex} className='mb-2 ml-2'>
                <div className='flex gap-5 mb-2 items-center'>
                  <div className='flex items-center'>
                    <div className='flex items-center'>
                      <span
                        className='flex items-center cursor-pointer'
                        onClick={() =>
                          toggleSkillMapResult(skillMapIndex, skillMapResult?.users?.id)
                        }
                      >
                        <Suspense fallback={<Icon icon='ChevronRight' />}>
                          <span className='mr-2'>
                            {skillMapResultToggledState[skillMapIndex] ? (
                              <Icon icon='ChevronDown' />
                            ) : (
                              <Icon icon='ChevronRight' />
                            )}
                          </span>
                        </Suspense>
                        <span className='mr-2'>
                          {skillMapResult.users?.last_name}, {skillMapResult.users?.first_name}
                        </span>
                        <Badge
                          variant={getSkillMapResultStatusVariant(skillMapResult?.status)}
                          size='small'
                        >
                          <div className='uppercase'>{skillMapResult?.status}</div>
                        </Badge>
                      </span>
                    </div>
                  </div>
                </div>
                {skillMapResultToggledState[skillMapIndex] && (
                  <div className='flex flex-col gap-4 mx-12'>
                    <div className='flex flex-col gap-4'>
                      <PageSubTitle>Skills</PageSubTitle>
                      {loading === Loading.Pending && (
                        <div className='w-full h-full flex flex-col justify-center items-center gap-2 p-4 rounded-md shadow-md'>
                          <Skeleton className='w-60 h-5' />
                        </div>
                      )}
                      {skillsTable(skillMapResult)}
                    </div>
                    <div className='flex flex-col gap-4'>
                      <PageSubTitle>Other Skills</PageSubTitle>
                      {loading === Loading.Pending && (
                        <div className='w-full h-full flex flex-col justify-center items-center gap-2 p-4 rounded-md shadow-md'>
                          <Skeleton className='w-60 h-5' />
                        </div>
                      )}
                      {otherSkillsTable(skillMapResult)}
                    </div>
                    <div className='flex flex-col gap-4'>
                      <PageSubTitle>Comments</PageSubTitle>
                      {loading === Loading.Pending && (
                        <div className='w-full h-full flex flex-col justify-center items-center gap-2 p-4 rounded-md shadow-md'>
                          <Skeleton className='w-60 h-5' />
                        </div>
                      )}
                      <p className='text-sm'>{getComment(skillMapResult)}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  )
}
