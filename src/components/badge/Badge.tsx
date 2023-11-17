import { type VariantProps, cva } from "class-variance-authority"

const badge = cva(
  ["w-fit", "h-fit", "flex", "items-center", "leading-4", "font-medium", "rounded-full"],
  {
    variants: {
      variant: {
        primary: ["bg-primary-500", "text-white"],
        pink: ["bg-pink-500", "text-white"],
        yellow: ["bg-yellow-500", "text-white"],
        green: ["bg-green-500", "text-white"],
        blue: ["bg-blue-500", "text-white"],
        gray: ["bg-gray-500", "text-white"],
        greenOutline: ["border", "border-green-500", "text-green-500"],
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
