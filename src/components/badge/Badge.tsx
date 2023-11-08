import { type VariantProps, cva } from "class-variance-authority"

const badge = cva(
  [
    "text-white",
    "text-[10px]",
    "leading-4",
    "font-medium",
    "px-2.5",
    "py-0.5",
    "rounded-full",
  ],
  {
    variants: {
      color: {
        primary: ["bg-primary-500"],
        pink: ["bg-pink-500"],
        yellow: ["bg-yellow-500"],
        green: ["bg-green-500"],
        blue: ["bg-blue-500"],
        gray: ["bg-gray-500"],
      },
    },
    defaultVariants: {
      color: "primary",
    },
  }
)

interface BadgeProps extends VariantProps<typeof badge> {
  children: React.ReactNode
}

export const Badge = ({ children, color }: BadgeProps) => {
  return <span className={badge({ color })}>{children}</span>
}
