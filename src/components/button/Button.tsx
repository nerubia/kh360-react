import { type VariantProps, cva } from "class-variance-authority"
import { Spinner } from "../spinner/Spinner"

const button = cva(["w-fit", "h-fit", "rounded-md"], {
  variants: {
    variant: {
      primary: [
        "bg-primary-500",
        "text-white",
        "enabled:hover:bg-primary-600",
        "enabled:active:bg-primary-700",
        "disabled:bg-primary-200",
      ],
      primaryOutline: [
        "border",
        "border-primary-500",
        "text-primary-500",
        "enabled:hover:bg-primary-600",
        "enabled:hover:text-white",
        "enabled:active:bg-primary-700",
        "disabled:border-primary-200",
        "disabled:text-primary-200",
      ],
      destructive: [
        "bg-red-500",
        "text-white",
        "enabled:hover:bg-red-600",
        "enabled:active:bg-red-700",
        "disabled:bg-red-200",
      ],
      destructiveOutline: [
        "border",
        "border-red-500",
        "text-red-500",
        "enabled:hover:bg-red-600",
        "enabled:hover:text-white",
        "enabled:active:bg-red-700",
        "disabled:border-red-200",
        "disabled:text-red-200",
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
  children: React.ReactNode
  onClick: () => void
  loading?: boolean
}

export const Button = ({
  children,
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
      {loading === true ? (
        <Spinner />
      ) : (
        <div className='flex justify-center items-center gap-2'>{children}</div>
      )}
    </button>
  )
}
