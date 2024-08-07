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
    "z-10",
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
          "slider-thumb:w-5",
          "slider-thumb:h-5",
          "moz-slider-thumb:w-5",
          "moz-slider-thumb:h-5",
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
  max = 10,
}: SliderProps) => {
  const steps = max - min
  let backgroundWidth

  if (sliderValue !== undefined) {
    const normalizedValue = Math.max(Math.min(sliderValue, max), min)
    backgroundWidth = ((normalizedValue - min) / (max - min)) * 100
  } else {
    backgroundWidth = 100
  }

  const rangePoints = Array.from({ length: steps + 1 }, (_, index) => {
    return (
      <div
        key={index}
        className={`w-3 h-3 bg-gray-200 border-2 border-primary-200 rounded-full z-100 hover:bg-primary-300 cursor-pointer`}
      ></div>
    )
  })

  return (
    <div className='relative w-full '>
      <div
        className='absolute top-2.5 h-2 bg-primary-500 rounded-full z-50 pointer-events-none'
        style={{ width: `${backgroundWidth}%` }}
      ></div>
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
      <div className='absolute top-2 w-full flex justify-between'>{rangePoints}</div>
    </div>
  )
}
