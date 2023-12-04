import React from "react"
import { type VariantProps, cva } from "class-variance-authority"
import { TooltipTrigger } from "./tooltip-trigger"
import { TooltipContent } from "./tooltip-content"

const tooltip = cva(
  [
    "absolute",
    "z-50",
    "w-max",
    "bg-[#fff8c5]",
    "text-[#9b6700]",
    "text-xs",
    "border",
    "border-[#f1dd9f]",
    "rounded-md",
    "p-1.5",
    "invisible",
    "group-hover:visible",
  ],
  {
    variants: {
      placement: {
        top: ["bottom-full", "left-1/2", "-translate-x-1/2", "mb-1"],
        topStart: ["bottom-full", "left-0", "mb-1"],
        topEnd: ["bottom-full", "right-0", "mb-1"],
        bottom: ["left-1/2", "-translate-x-1/2", "mt-1"],
        bottomStart: ["left-0", "mt-1"],
        bottomEnd: ["right-0", "mt-1"],
        left: ["top-1/2", "-translate-y-1/2", "right-full", "mr-1"],
        right: ["top-1/2", "-translate-y-1/2", "left-full", "ml-1"],
      },
    },
    defaultVariants: {
      placement: "top",
    },
  }
)

interface TooltipProps extends VariantProps<typeof tooltip> {
  children: React.ReactNode
}

function Tooltip({ children, placement }: TooltipProps) {
  return (
    <div className='relative w-fit'>
      <div className='group'>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === Tooltip.Trigger) {
            return React.cloneElement(child)
          }
          return null
        })}
        <div className={tooltip({ placement })}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === Tooltip.Content) {
              return React.cloneElement(child)
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}

Tooltip.Trigger = TooltipTrigger
Tooltip.Content = TooltipContent

export default Tooltip
