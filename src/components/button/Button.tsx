import { NavLink } from "react-router-dom"
import { type VariantProps, cva } from "class-variance-authority"
import { Spinner } from "../spinner/Spinner"

const button = cva(["w-fit", "h-fit", "rounded-md"], {
  variants: {
    variant: {
      primary: [
        "bg-primary-500",
        "text-white",
        "hover:bg-primary-600",
        "active:bg-primary-700",
        "disabled:bg-primary-200",
      ],
      primaryOutline: [
        "border",
        "border-primary-500",
        "text-primary-500",
        "hover:bg-primary-600",
        "hover:text-white",
        "active:bg-primary-700",
        "disabled:bg-white",
        "disabled:border-primary-200",
        "disabled:text-primary-200",
      ],
      destructive: [
        "bg-red-500",
        "text-white",
        "hover:bg-red-600",
        "active:bg-red-700",
        "disabled:bg-red-200",
      ],
      destructiveOutline: [
        "border",
        "border-red-500",
        "text-red-500",
        "hover:bg-red-600",
        "hover:text-white",
        "active:bg-red-700",
        "disabled:bg-white",
        "disabled:border-red-200",
        "disabled:text-red-200",
      ],
      ghost: [
        "hover:bg-gray-100",
        "active:bg-gray-200",
        "disabled:bg-gray-100",
      ],
      unstyled: ["!p-0"],
      menu: [
        "bg-primary-500",
        "text-white",
        "hover:bg-primary-600",
        "active:bg-primary-700",
        "disabled:bg-primary-200",
        "[&.active]:bg-primary-700",
      ],
    },
    size: {
      small: ["text-sm", "px-2", "py-1"],
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

interface LinkButtonProps extends VariantProps<typeof button> {
  children: React.ReactNode
  to: string
}

export const LinkButton = ({
  children,
  to,
  variant,
  size,
  fullWidth,
}: LinkButtonProps) => {
  return (
    <NavLink to={to} className={button({ variant, size, fullWidth })}>
      <div className='flex justify-center items-center gap-2'>{children}</div>
    </NavLink>
  )
}
