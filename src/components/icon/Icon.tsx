import { createElement } from "react"
import { type VariantProps, cva } from "class-variance-authority"
import { icons } from "./icons"

const iconVariants = cva([], {
  variants: {
    color: {
      primary: "text-primary-500",
      black: "text-black",
      white: "text-white",
      red: "text-red-500",
    },
  },
  defaultVariants: {
    color: "primary",
  },
})

interface IconProps extends VariantProps<typeof iconVariants> {
  icon: keyof typeof icons
}

export const Icon = ({ icon, color }: IconProps) => {
  return (
    <div className={iconVariants({ color })}>{createElement(icons[icon])}</div>
  )
}
