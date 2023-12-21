import { type VariantProps, cva } from "class-variance-authority"

const progress = cva(["h-full", "rounded-full"], {
  variants: {
    variant: {
      primary: ["bg-primary-500"],
      green: ["bg-[#8fc862]"],
      blue: ["bg-[#b7e0ff]"],
      red: ["bg-[#edc9d4]"],
      orange: ["bg-[#ffd3c9]"],
      yellow: ["bg-[#f4ba42]"],
      lightGreen: ["bg-[#bbeec7]"],
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
