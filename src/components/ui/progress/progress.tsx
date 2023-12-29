import { type VariantProps, cva } from "class-variance-authority"

const progress = cva(["h-full", "rounded-full"], {
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
  },
  defaultVariants: {
    variant: "primary",
  },
})

interface ProgressProps extends VariantProps<typeof progress> {
  value: number
  width: string
}

export const Progress = ({ value, width, variant }: ProgressProps) => {
  return (
    <div className={`bg-slate-200 w-full h-5 md:${width} rounded-full`}>
      <div className={progress({ variant })} style={{ width: `${value}%` }}></div>
    </div>
  )
}
