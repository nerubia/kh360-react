import { NavLink } from "react-router-dom"
import { type VariantProps, cva } from "class-variance-authority"
import { Spinner } from "@components/ui/spinner/spinner"

const button = cva(["w-fit", "rounded-md", "flex", "items-center", "gap-2", "outline-none"], {
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
      textLink: [
        "text-primary-500",
        "border-b-2",
        "border-transparent",
        "hover:text-white",
        "hover:bg-primary-500",
      ],
      ghost: ["hover:bg-gray-100", "active:bg-gray-200", "disabled:bg-gray-100"],
      unstyled: ["!p-0"],
      star: ["text-primary-500", "active:text-primary-500", "hover:text-primary-500"],
      starEmpty: [
        "text-gray-200",
        "hover:text-primary-300",
        "active:text-primary-300",
        "disabled:text-gray-100",
      ],
      NAOption: [
        "mr-2.5",
        "bg-primary-500",
        "text-white",
        "hover:bg-primary-600",
        "active:bg-primary-700",
        "disabled:bg-primary-500",
      ],
      NAOptionEmpty: [
        "mr-2.5",
        "bg-gray-100",
        "text-gray-400",
        "hover:bg-primary-300",
        "hover:text-white",
        "active:bg-primary-700",
        "disabled:bg-white",
        "disabled:border-primary-200",
        "disabled:text-primary-200",
      ],
      tag: [
        "mr-2.5",
        "bg-primary-100",
        "text-gray-500",
        "active:bg-primary-200",
        "disabled:bg-white",
        "disabled:border-primary-200",
        "disabled:text-primary-200",
      ],
    },
    size: {
      extraSmall: ["h-5", "text-xs", "px-2"],
      small: ["h-7", "text-sm", "px-2"],
      medium: ["h-9", "text-base", "px-4"],
    },
    center: {
      true: "justify-center",
    },
    fullWidth: {
      true: "!w-full",
    },
    fullHeight: {
      true: ["py-1", "!h-full"],
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "medium",
    center: true,
  },
})

interface ButtonProps extends VariantProps<typeof button> {
  testId?: string
  children: React.ReactNode
  onClick?: (event: React.MouseEvent) => void
  loading?: boolean
  disabled?: boolean
}

export const Button = ({
  testId,
  children,
  variant,
  size,
  fullWidth,
  fullHeight,
  center,
  onClick,
  loading,
  disabled,
}: ButtonProps) => {
  return (
    <button
      data-testid={testId}
      className={button({ variant, size, fullWidth, fullHeight, center })}
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
  onClick?: (event: React.MouseEvent) => void
}

export const LinkButton = ({
  testId,
  children,
  to,
  variant,
  size,
  fullWidth,
  center,
  onClick,
}: LinkButtonProps) => {
  return (
    <NavLink
      data-testid={testId}
      to={to}
      className={button({ variant, size, fullWidth, center })}
      onClick={onClick}
    >
      {children}
    </NavLink>
  )
}
