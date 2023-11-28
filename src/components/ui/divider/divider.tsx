import { type VariantProps, cva } from "class-variance-authority"

const divider = cva([], {
  variants: {
    orientation: {
      horizontal: ["w-auto", "border-t"],
      vertical: ["h-auto", "border-r"],
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

export const Divider = ({ orientation }: VariantProps<typeof divider>) => {
  return <div className={divider({ orientation })}></div>
}
