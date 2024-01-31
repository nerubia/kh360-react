import { useEffect, useState } from "react"
import navigationalChallenge from "@assets/navigational-challenge.png"
import needsGps from "@assets/needs-gps.png"
import smoothSailing from "@assets/smooth-sailing.png"
import rocketBooster from "@assets/rocket-booster.png"
import unicornStatus from "@assets/unicorn-status.png"
import { type VariantProps, cva } from "class-variance-authority"
import { type ScoreRating } from "@custom-types/score-rating-type"
import { getScoreRatings } from "@redux/slices/user-slice"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAppSelector } from "@hooks/useAppSelector"
import { Progress } from "@components/ui/progress/progress"
import { getScoreRatingVariant } from "@utils/variant"
import { getScoreRatingBackgroundColor } from "@utils/colors"
import { Icon } from "@components/ui/icon/icon"

const scoreRange = cva([], {
  variants: {
    size: {
      extraSmall: ["w-4", "h-4"],
      small: ["w-6", "h-6"],
      medium: ["w-10", "h-10"],
    },
  },
  defaultVariants: {
    size: "medium",
  },
})

interface ScoreRangeProps extends VariantProps<typeof scoreRange> {
  user_picture?: string
  score_rating?: ScoreRating
  score?: number
  is_evaluee: boolean
  showDetails?: boolean
}

export const ScoreRange = ({
  score_rating,
  score,
  is_evaluee,
  user_picture,
  size,
  showDetails = true,
}: ScoreRangeProps) => {
  const appDispatch = useAppDispatch()
  const { score_ratings } = useAppSelector((state) => state.user)
  const displayScore = ((score ?? 0) - 0.25) * 10
  const [onError, setOnError] = useState<boolean>(false)
  const scoreImages: Record<string, string> = {
    "Navigational Challenge": navigationalChallenge,
    "Needs a GPS": needsGps,
    "Smooth Sailing": smoothSailing,
    "Rocket Booster": rocketBooster,
    "Unicorn Status": unicornStatus,
  }

  useEffect(() => {
    void appDispatch(getScoreRatings())
  }, [])

  const getColor = (score_rating: string, icon: string) => {
    if (score_rating !== icon) {
      return "invert(94%) sepia(1%) saturate(5088%) hue-rotate(186deg) brightness(100%) contrast(91%)"
    }
    if (score_rating === "Needs Improvement") {
      return "invert(25%) sepia(96%) saturate(1637%) hue-rotate(343deg) brightness(98%) contrast(93%)"
    }
    if (score_rating === "Fair") {
      return "invert(48%) sepia(30%) saturate(1756%) hue-rotate(337deg) brightness(89%) contrast(91%)"
    }
    if (score_rating === "Satisfactory") {
      return "invert(76%) sepia(44%) saturate(654%) hue-rotate(348deg) brightness(96%) contrast(99%)"
    }
    if (score_rating === "Good") {
      return "invert(74%) sepia(17%) saturate(1013%) hue-rotate(51deg) brightness(93%) contrast(94%)"
    }
    if (score_rating === "Excellent") {
      return "invert(57%) sepia(56%) saturate(476%) hue-rotate(53deg) brightness(96%) contrast(94%)"
    }
  }
  return (
    <div className='flex flex-col gap-2'>
      {score_rating !== undefined && score_rating !== null && (
        <>
          <div className='flex-1 flex flex-col gap-4'>
            <div className='flex justify-between md:gap-8 sm:min-w-0'>
              {score_ratings?.map((score) => (
                <div
                  key={score.id}
                  className={`text-center pb-2 flex flex-col items-center ${
                    size === "small" ? "text-sm" : "text-xs"
                  }`}
                  style={{
                    filter: getColor(score_rating.name, score.name),
                  }}
                >
                  <img
                    className={scoreRange({ size })}
                    src={scoreImages[score?.display_name]}
                    alt=''
                  />
                  {score?.display_name}
                </div>
              ))}
            </div>
            <div className='flex justify-center pb-5 relative w-full'>
              <div className='absolute inset-0'>
                <Progress
                  variant={getScoreRatingVariant(score_rating?.name ?? "")}
                  value={(score ?? 0) * 10}
                  width='full'
                  size={size}
                />
              </div>
              {user_picture === undefined || user_picture === null || onError ? (
                <div
                  className={`w-10 h-10 flex justify-center items-center rounded-full absolute ${
                    size === "small" ? "-top-4" : "-top-3"
                  } ${getScoreRatingBackgroundColor(score_rating?.name ?? "")}`}
                  style={{ left: `${displayScore}%` }}
                >
                  <Icon icon='UserFill' color='white' />
                </div>
              ) : (
                <img
                  className={`w-10 h-10 rounded-full absolute -top-3`}
                  style={{ left: `${displayScore}%` }}
                  src={user_picture}
                  onError={() => setOnError(true)}
                />
              )}
            </div>
          </div>
          {showDetails && (
            <>
              <div
                className='flex font-bold mt-5 ml-5'
                style={{
                  filter: getColor(score_rating.name, score_rating.name),
                }}
              >
                {score_rating.display_name}
              </div>
              <pre className='flex font-sans break-words whitespace-pre-wrap text-xs md:text-sm italic leading-loose ml-5 md:w-[860px]'>
                {is_evaluee ? score_rating.evaluee_description : score_rating.result_description}
              </pre>
            </>
          )}
        </>
      )}
    </div>
  )
}
