import { type VariantProps, cva } from "class-variance-authority"

const badge = cva(
  [
    "w-fit",
    "h-fit",
    "flex",
    "items-center",
    "text-[10px]",
    "leading-4",
    "font-medium",
    "px-2.5",
    "py-0.5",
    "rounded-full",
  ],
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
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

interface BadgeProps extends VariantProps<typeof badge> {
  children: React.ReactNode
}

export const Badge = ({ children, variant }: BadgeProps) => {
  return <span className={badge({ variant })}>{children}</span>
}
