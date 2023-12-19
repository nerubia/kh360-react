import { type VariantProps, cva } from "class-variance-authority"

const badge = cva(["w-fit", "h-fit", "flex", "items-center", "rounded-full"], {
  variants: {
    variant: {
      primary: ["bg-[#fbefff]"],
      pink: ["bg-[#fff0f7]"],
      yellow: ["bg-[#e6d98c]"],
      green: ["bg-[#aedbad]"],
      blue: ["bg-[#b9e3ff]"],
      gray: ["bg-[#f6f8fa]"],
      orange: ["bg-[#fff0e4]"],
      red: ["bg-[#ffebe8]"],
    },
    size: {
      small: ["w-1.5", "h-1.5"],
      medium: ["w-6", "h-6"],
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
})

interface BadgeProps extends VariantProps<typeof badge> {}

export const StatusBadge = ({ variant, size }: BadgeProps) => {
  return <span className={badge({ variant, size })}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
}
