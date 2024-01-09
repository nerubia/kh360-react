import { type VariantProps, cva } from "class-variance-authority"

const progress = cva(["rounded-full"], {
  variants: {
    variant: {
      primary: ["bg-primary-500"],
      green: ["bg-customGreen-500"],
      blue: ["bg-customBlue-500"],
      red: ["bg-customRed-500"],
      orange: ["bg-customOrange-500"],
      yellow: ["bg-customYellow-500"],
      lightGreen: ["bg-customLightGreen-500"],
    },
    size: {
      extraSmall: ["h-2"],
      small: ["h-3"],
      medium: ["h-5"],
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
})

interface ProgressProps extends VariantProps<typeof progress> {
  value: number
  width: string
}

export const Progress = ({ value, width, variant, size }: ProgressProps) => {
  return (
    <div className={`bg-slate-200 w-full md:${width} rounded-full ${progress({ size })}`}>
      <div className={progress({ variant, size })} style={{ width: `${value}%` }}></div>
    </div>
  )
}
