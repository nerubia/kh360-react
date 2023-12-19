import { type VariantProps, cva } from "class-variance-authority"

const badge = cva(
  [
    "w-fit",
    "h-fit",
    "flex",
    "items-center",
    "justify-center",
    "rounded-full",
    "p-1 px-2 pt-0 pb-0",
  ],
  {
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
        small: ["w-2", "h-1.5"],
        medium: ["w-6", "h-6"],
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
)

interface BadgeProps extends VariantProps<typeof badge> {
  children: React.ReactNode
}

export const StatusBadge = ({ variant, size, children }: BadgeProps) => {
  const firstLetter = children?.toString().charAt(0)

  return <span className={badge({ variant, size })}>{firstLetter}</span>
}
