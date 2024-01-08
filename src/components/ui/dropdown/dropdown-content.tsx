import { type VariantProps, cva } from "class-variance-authority"

const dropdown = cva([], {
  variants: {
    size: {
      small: ["w-40"],
      medium: ["w-60"],
    },
  },
  defaultVariants: {
    size: "medium",
  },
})
interface DropdownContentProps extends VariantProps<typeof dropdown> {
  children: React.ReactNode
  size?: "small" | "medium"
}

export const DropdownContent = ({ children, size = "medium" }: DropdownContentProps) => {
  return (
    <div className={`absolute right-0 z-50 pt-1 ${dropdown({ size })}`}>
      <div className='bg-white flex flex-col gap-1 border rounded-md shadow-md p-1'>{children}</div>
    </div>
  )
}
