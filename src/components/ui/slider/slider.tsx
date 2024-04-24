import { type VariantProps, cva } from "class-variance-authority"

const slider = cva(
  [
    "relative",
    "w-full",
    "bg-gray-200",
    "rounded-full",
    "appearance-none",
    "cursor-pointer",
    "slider-thumb:appearance-none",
    "moz-slider-thumb:appearance-none",
    "z-30",
    "slider-thumb:rounded-full",
    "moz-slider-thumb:rounded-full",
  ],
  {
    variants: {
      variant: {
        primary: ["slider-thumb:bg-primary-500", "moz-slider-thumb:bg-primary-500"],
        empty: ["slider-thumb:bg-transparent", "moz-slider-thumb:bg-transparent"],
      },
      size: {
        medium: [
          "h-2",
          "slider-thumb:w-6",
          "slider-thumb:h-6",
          "moz-slider-thumb:w-6",
          "moz-slider-thumb:h-6",
        ],
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
)

interface SliderProps extends VariantProps<typeof slider> {
  sliderValue?: number
  min?: number
  max?: number
  handleSliderChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
}

export const Slider = ({
  sliderValue,
  handleSliderChange,
  onClick,
  variant,
  size,
  disabled,
  min = 1,
  max = 3,
}: SliderProps) => {
  const steps = max - min

  const rangePoints = Array.from({ length: steps + 1 }, (_, index) => {
    const left = index === 0 ? 0 : (index / steps) * 100 - 3
    const pointPosition = index === steps ? { right: 0 } : { left: `${left}%` }

    return (
      <div
        key={index}
        className={`absolute top-1 w-5 h-5 bg-gray-200 border-2 border-gray-200 rounded-full z-10 hover:bg-primary-300 cursor-pointer`}
        style={pointPosition}
      ></div>
    )
  })

  return (
    <div className='relative w-full'>
      <input
        type='range'
        min={min}
        max={max}
        value={sliderValue}
        onChange={handleSliderChange}
        className={slider({ variant, size })}
        disabled={disabled}
        onClick={onClick}
      />
      {rangePoints}
    </div>
  )
}
