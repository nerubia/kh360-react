import { type VariantProps, cva } from "class-variance-authority"
import { Spinner } from "../spinner/Spinner"

const button = cva(["w-fit", "h-fit", "rounded-md"], {
  variants: {
    variant: {
      primary: [
        "bg-blue-500",
        "text-white",
        "enabled:hover:bg-blue-600",
        "enabled:active:bg-blue-700",
      ],
      primaryOutline: [
        "border",
        "border-blue-500",
        "text-blue-500",
        "enabled:hover:bg-blue-600",
        "enabled:hover:text-white",
        "enabled:active:bg-blue-700",
      ],
      destructive: [
        "bg-red-500",
        "text-white",
        "enabled:hover:bg-red-600",
        "enabled:active:bg-red-700",
      ],
      destructiveOutline: [
        "border",
        "border-red-500",
        "text-red-500",
        "enabled:hover:bg-red-600",
        "enabled:hover:text-white",
        "enabled:active:bg-red-700",
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
      {loading === true ? <Spinner /> : name}
    </button>
  )
}
