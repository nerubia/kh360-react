import { type VariantProps, cva } from "class-variance-authority"

const badge = cva(
  ["w-fit", "h-fit", "flex", "items-center", "leading-4", "font-medium", "border", "rounded-full"],
  {
    variants: {
      variant: {
        primary: ["bg-customPurple-100", "text-customPurple-700", "border-customPurple-400"],
        darkPurple: ["bg-primary-500", "text-white", "border-customPurple-400"],
        pink: ["bg-customPink-100", "text-customPink-700", "border-customPink-200"],
        yellow: ["bg-customYellow-300", "text-customBrown-500", "border-customYellow-400"],
        green: ["bg-customLightGreen-100", "text-customGreen-700", "border-customGreen-300"],
        blue: ["bg-customBlue-100", "text-customBlue-700", "border-customBlue-500"],
        gray: ["bg-slate-100", "text-gray-500", "border-slate-300"],
        orange: ["bg-customOrange-100", "text-customOrange-700", "border-customOrange-300"],
        red: ["bg-customRed-100", "text-customRed-700", "border-customRed-300"],
      },
      size: {
        extraSmall: ["text-[10px]", "px-2", "py-0.5"],
        small: ["text-[10px]", "px-2.5", "py-0.5"],
        medium: ["text-base", "px-4", "py-1.5"],
        iconSize: ["text-[14px]", "px-2.5", "py-1"],
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
