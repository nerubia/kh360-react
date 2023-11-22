import { type VariantProps, cva } from "class-variance-authority"

const badge = cva(
  [
    "w-fit",
    "h-fit",
    "flex",
    "items-center",
    "leading-4",
    "font-medium",
    "border",
    "border-current",
    "rounded-full",
  ],
  {
    variants: {
      variant: {
        primary: ["bg-[#fbefff]", "text-[#8250df]", "border-[#e6ceff]"],
        pink: ["bg-[#fff0f7]", "text-[#bf3989]", "border-[#ffe4f3]"],
        yellow: ["bg-[#fff8c5]", "text-[#9b6700]", "border-[#f1dd9f]"],
        green: ["bg-[#dafbe1]", "text-[#1b7f37]", "border-[#bbeec7]"],
        blue: ["bg-[#ddf4ff]", "text-[#0a69da]", "border-[#b7e0ff]"],
        gray: ["bg-[#f6f8fa]", "text-[#646d76]", "border-[#dbe1e6]"],
        red: ["bg-[#ffebe8]", "text-[#d1242f]", "border-[#ffcac8]"],
      },
      size: {
        small: ["text-[10px]", "px-2.5", "py-0.5"],
        medium: ["text-base", "px-4", "py-1.5"],
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

export const Badge = ({ children, variant, size }: BadgeProps) => {
  return <span className={badge({ variant, size })}>{children}</span>
}
