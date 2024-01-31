import { createElement } from "react"
import { type VariantProps, cva } from "class-variance-authority"
import { icons } from "@components/ui/icon/icons"

const iconVariants = cva([], {
  variants: {
    color: {
      primary: "text-primary-500",
      black: "text-black",
      gray: "text-gray-500",
      white: "text-white",
      red: "text-red-500",
    },
    size: {
      extraSmall: 15,
      small: 20,
      medium: 24,
      large: 32,
    },
  },
  defaultVariants: {
    size: "medium",
  },
})

interface IconProps extends VariantProps<typeof iconVariants> {
  icon: keyof typeof icons
}

export const Icon = ({ icon, color, size }: IconProps) => {
  return (
    <div className={iconVariants({ color })}>
      {createElement(icons[icon], {
        size: parseInt(iconVariants({ size })),
      })}
    </div>
  )
}
