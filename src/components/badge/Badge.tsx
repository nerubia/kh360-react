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
        primary: ["bg-primary-200", "text-primary-600"],
        pink: ["bg-pink-200", "text-pink-600"],
        yellow: ["bg-yellow-200", "text-yellow-600"],
        green: ["bg-green-200", "text-green-600"],
        blue: ["bg-blue-200", "text-blue-600"],
        gray: ["bg-gray-200", "text-gray-600"],
        red: ["bg-red-200", "text-red-600"],
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
