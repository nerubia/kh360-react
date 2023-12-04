import { type VariantProps, cva } from "class-variance-authority"

const progress = cva(["h-full", "rounded-full"], {
  variants: {
    variant: {
      primary: ["bg-primary-500"],
      green: ["bg-[#bbeec7]"],
      blue: ["bg-[#b7e0ff]"],
    },
  },
  defaultVariants: {
    variant: "primary",
  },
})

interface ProgressProps extends VariantProps<typeof progress> {
  value: number
}

export const Progress = ({ value, variant }: ProgressProps) => {
  return (
    <div className='bg-slate-200 w-full h-5 md:w-96 rounded-full'>
      <div className={progress({ variant })} style={{ width: `${value}%` }}></div>
    </div>
  )
}
