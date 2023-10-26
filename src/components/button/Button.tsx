import { NavLink } from "react-router-dom"
import { type VariantProps, cva } from "class-variance-authority"
import { Spinner } from "../spinner/Spinner"

const button = cva(
  ["w-fit", "h-fit", "rounded-md", "flex", "items-center", "gap-2"],
  {
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
          "[&.active]:cursor-default",
        ],
        project: [
          "text-black",
          "hover:bg-gray-100",
          "active:bg-primary-500",
          "[&.active]:bg-primary-500",
          "[&.active]:text-white",
          "[&.active]:cursor-default",
        ],
      },
      size: {
        small: ["text-sm", "px-2", "py-1"],
        medium: ["text-base", "px-4", "py-2"],
      },
      center: {
        true: "justify-center",
      },
      fullWidth: {
        true: "!w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
      center: true,
    },
  }
)

interface ButtonProps extends VariantProps<typeof button> {
  testId?: string
  children: React.ReactNode
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
}

export const Button = ({
  testId,
  children,
  variant,
  size,
  fullWidth,
  center,
  onClick,
  loading,
  disabled,
}: ButtonProps) => {
  return (
    <button
      data-testid={testId}
      className={button({ variant, size, fullWidth, center })}
      onClick={onClick}
      disabled={loading === true || disabled === true}
    >
      {loading === true ? <Spinner /> : children}
    </button>
  )
}

interface LinkButtonProps extends VariantProps<typeof button> {
  testId?: string
  children: React.ReactNode
  to: string
}

export const LinkButton = ({
  testId,
  children,
  to,
  variant,
  size,
  fullWidth,
  center,
}: LinkButtonProps) => {
  return (
    <NavLink
      data-testid={testId}
      to={to}
      className={button({ variant, size, fullWidth, center })}
    >
      {children}
    </NavLink>
  )
}
