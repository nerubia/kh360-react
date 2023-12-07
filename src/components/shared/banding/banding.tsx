import veryLow from "../../../assets/very-low.png"
import low from "../../../assets/low.png"
import moderateLow from "../../../assets/moderate-low.png"
import average from "../../../assets/average.png"
import moderateHigh from "../../../assets/moderate-high.png"
import high from "../../../assets/high.png"
import veryHigh from "../../../assets/very-high.png"
import { type VariantProps, cva } from "class-variance-authority"
import Tooltip from "../../../components/ui/tooltip/tooltip"

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
        className={`${banding === "Very Low" ? "bg-[#edc9d4]" : "bg-gray-100"} rounded-full p-1`}
      >
        <Tooltip placement='topEnd'>
          <Tooltip.Trigger>
            <img className={band({ size })} src={veryLow} alt='' />
          </Tooltip.Trigger>
          <Tooltip.Content>Very Low</Tooltip.Content>
        </Tooltip>
      </div>
      <div
        className={`${banding === "Low" ? "bg-[#ffd3c9]" : "bg-gray-100"} w-fit rounded-full p-1`}
      >
        <Tooltip placement='topEnd'>
          <Tooltip.Trigger>
            <img className={band({ size })} src={low} alt='' />
          </Tooltip.Trigger>
          <Tooltip.Content>Low</Tooltip.Content>
        </Tooltip>
      </div>
      <div
        className={`${
          banding === "Moderate Low" ? "bg-[#fff7cf]" : "bg-gray-100"
        } w-fit rounded-full p-1`}
      >
        <Tooltip placement='topEnd'>
          <Tooltip.Trigger>
            <img className={band({ size })} src={moderateLow} alt='' />
          </Tooltip.Trigger>
          <Tooltip.Content>Moderate Low</Tooltip.Content>
        </Tooltip>
      </div>
      <div
        className={`${
          banding === "Average" ? "bg-[#e4f0c9]" : "bg-gray-100"
        } w-fit rounded-full p-1`}
      >
        <Tooltip placement='topEnd'>
          <Tooltip.Trigger>
            <img className={band({ size })} src={average} alt='' />
          </Tooltip.Trigger>
          <Tooltip.Content>Average</Tooltip.Content>
        </Tooltip>
      </div>
      <div
        className={`${
          banding === "Moderate High" ? "bg-[#c7e0ff]" : "bg-gray-100"
        } w-fit rounded-full p-1`}
      >
        <Tooltip placement='topEnd'>
          <Tooltip.Trigger>
            <img className={band({ size })} src={moderateHigh} alt='' />
          </Tooltip.Trigger>
          <Tooltip.Content>Moderate High</Tooltip.Content>
        </Tooltip>
      </div>
      <div
        className={`${banding === "High" ? "bg-[#cfcfff]" : "bg-gray-100"} w-fit rounded-full p-1`}
      >
        <Tooltip placement='topEnd'>
          <Tooltip.Trigger>
            <img className={band({ size })} src={high} alt='' />
          </Tooltip.Trigger>
          <Tooltip.Content>High</Tooltip.Content>
        </Tooltip>
      </div>
      <div
        className={`${
          banding === "Very High" ? "bg-[#bac3ff]" : "bg-gray-100"
        } w-fit rounded-full p-1`}
      >
        <Tooltip placement='topEnd'>
          <Tooltip.Trigger>
            <img className={band({ size })} src={veryHigh} alt='' />
          </Tooltip.Trigger>
          <Tooltip.Content>Very High</Tooltip.Content>
        </Tooltip>
      </div>
    </div>
  )
}

export default Banding
