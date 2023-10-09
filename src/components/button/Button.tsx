import { type VariantProps, cva } from "class-variance-authority"

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
      danger: [
        "bg-red-500",
        "text-white",
        "enabled:hover:bg-red-600",
        "enabled:active:bg-red-700",
      ],
      dangerOutline: [
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
      {loading === true ? (
        <div
          className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
          role='status'
        >
          <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
            Loading...
          </span>
        </div>
      ) : (
        name
      )}
    </button>
  )
}
