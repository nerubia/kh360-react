import veryLow from "../../../assets/very-low.png"
import low from "../../../assets/low.png"
import moderateLow from "../../../assets/moderate-low.png"
import average from "../../../assets/average.png"
import moderateHigh from "../../../assets/moderate-high.png"
import high from "../../../assets/high.png"
import veryHigh from "../../../assets/very-high.png"
import { type VariantProps, cva } from "class-variance-authority"

const band = cva([], {
  variants: {
    size: {
      small: ["w-6", "h-6"],
      medium: ["w-10", "h-10"],
    },
  },
  defaultVariants: {
    size: "medium",
  },
})

interface BandingProps extends VariantProps<typeof band> {
  banding: string
}

export const Banding = ({ banding, size }: BandingProps) => {
  return (
    <div className={`flex gap-3 justify-center`}>
      <div className={`${banding === "Very Low" ? "bg-red-600 " : "bg-gray-200"} rounded-full p-1`}>
        <img className={band({ size })} src={veryLow} alt='' />
      </div>
      <div
        className={`${banding === "Low" ? "bg-orange-600 " : "bg-gray-200"} w-fit rounded-full p-1`}
      >
        <img className={band({ size })} src={low} alt='' />
      </div>
      <div
        className={`${
          banding === "Moderate Low" ? "bg-yellow-600 " : "bg-gray-200"
        } w-fit rounded-full p-1`}
      >
        <img className={band({ size })} src={moderateLow} alt='' />
      </div>
      <div
        className={`${
          banding === "Average" ? "bg-green-600 " : "bg-gray-200"
        } w-fit rounded-full p-1`}
      >
        <img className={band({ size })} src={average} alt='' />
      </div>
      <div
        className={`${
          banding === "Moderate High" ? "bg-blue-600 " : "bg-gray-200"
        } w-fit rounded-full p-1`}
      >
        <img className={band({ size })} src={moderateHigh} alt='' />
      </div>
      <div
        className={`${
          banding === "High" ? "bg-indigo-600 " : "bg-gray-200"
        } w-fit rounded-full p-1`}
      >
        <img className={band({ size })} src={high} alt='' />
      </div>
      <div
        className={`${
          banding === "Very High" ? "bg-violet-600 " : "bg-gray-200"
        } w-fit rounded-full p-1`}
      >
        <img className={band({ size })} src={veryHigh} alt='' />
      </div>
    </div>
  )
}

export default Banding
