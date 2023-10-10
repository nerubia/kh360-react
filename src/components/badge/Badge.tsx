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
      variant: {
        primary: ["bg-primary-500"],
        secondary: ["bg-gray-500"],
        success: ["bg-green-500"],
        destructive: ["bg-red-500"],
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

interface BadgeProps extends VariantProps<typeof badge> {
  name: string
}

export const Badge = ({ name, variant }: BadgeProps) => {
  return <span className={badge({ variant })}>{name}</span>
}
