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
      <div
        className={`${banding === "Very Low" ? "bg-[#edc9d4]" : "bg-gray-200"} rounded-full p-1`}
      >
        <img className={band({ size })} src={veryLow} alt='' />
      </div>
      <div
        className={`${banding === "Low" ? "bg-[#ffd3c9]" : "bg-gray-200"} w-fit rounded-full p-1`}
      >
        <img className={band({ size })} src={low} alt='' />
      </div>
      <div
        className={`${
          banding === "Moderate Low" ? "bg-[#fff7cf]" : "bg-gray-200"
        } w-fit rounded-full p-1`}
      >
        <img className={band({ size })} src={moderateLow} alt='' />
      </div>
      <div
        className={`${
          banding === "Average" ? "bg-[#e4f0c9]" : "bg-gray-200"
        } w-fit rounded-full p-1`}
      >
        <img className={band({ size })} src={average} alt='' />
      </div>
      <div
        className={`${
          banding === "Moderate High" ? "bg-[#c7e0ff]" : "bg-gray-200"
        } w-fit rounded-full p-1`}
      >
        <img className={band({ size })} src={moderateHigh} alt='' />
      </div>
      <div
        className={`${banding === "High" ? "bg-[#cfcfff]" : "bg-gray-200"} w-fit rounded-full p-1`}
      >
        <img className={band({ size })} src={high} alt='' />
      </div>
      <div
        className={`${
          banding === "Very High" ? "bg-[#bac3ff]" : "bg-gray-200"
        } w-fit rounded-full p-1`}
      >
        <img className={band({ size })} src={veryHigh} alt='' />
      </div>
    </div>
  )
}

export default Banding
