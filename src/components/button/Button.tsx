import { type VariantProps, cva } from "class-variance-authority"

const button = cva(["w-fit", "h-fit", "rounded-md"], {
  variants: {
    variant: {
      primary: ["bg-blue-500", "text-white", "hover:bg-blue-600"],
      primaryOutline: [
        "border",
        "border-blue-500",
        "text-blue-500",
        "hover:bg-blue-600",
        "hover:text-white",
      ],
      danger: ["bg-red-500", "text-white", "hover:bg-red-600"],
      dangerOutline: [
        "border",
        "border-red-500",
        "text-red-500",
        "hover:bg-red-600",
        "hover:text-white",
      ],
    },
    size: {
      sm: ["text-sm", "px-2", "py-1"],
      medium: ["text-base", "px-4", "py-2"],
    },
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
})

interface ButtonProps extends VariantProps<typeof button> {
  name: string
  onClick: () => void
  loading?: boolean
}

export const Button = ({
  name,
  variant,
  size,
  fullWidth,
  onClick,
  loading,
}: ButtonProps) => {
  return (
    <button
      className={button({ variant, size, fullWidth })}
      onClick={onClick}
      disabled={loading}
    >
      {loading === true ? "Loading" : name}
    </button>
  )
}
