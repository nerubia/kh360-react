import React from "react"
import { type VariantProps, cva } from "class-variance-authority"
import { TooltipTrigger } from "@components/ui/tooltip/tooltip-trigger"
import { TooltipContent } from "@components/ui/tooltip/tooltip-content"

const tooltip = cva(["absolute", "z-50", "invisible", "group-hover:visible"], {
  variants: {
    placement: {
      top: ["bottom-full", "left-1/2", "-translate-x-1/2", "pb-1"],
      topStart: ["bottom-full", "left-0", "pb-1"],
      topEnd: ["bottom-full", "right-0", "pb-1"],
      bottom: ["left-1/2", "-translate-x-1/2", "pt-1"],
      bottomStart: ["left-0", "pt-1"],
      bottomEnd: ["right-0", "pt-1"],
      left: ["top-1/2", "-translate-y-1/2", "right-full", "pr-1"],
      right: ["top-1/2", "-translate-y-1/2", "left-full", "pl-1"],
    },
    size: {
      default: ["w-max", "max-w-md"],
      medium: ["break-word", "min-w-[140px]"],
    },
  },
  defaultVariants: {
    placement: "top",
    size: "default",
  },
})

interface TooltipProps extends VariantProps<typeof tooltip> {
  children: React.ReactNode
  wFit?: boolean
}

function Tooltip({ children, placement, size, wFit = true }: TooltipProps) {
  return (
    <div className={`relative ${wFit ? "w-fit" : ""}`}>
      <div className='group'>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === Tooltip.Trigger) {
            return React.cloneElement(child)
          }
          return null
        })}
        <div className={tooltip({ placement, size })}>
          <div className='bg-customYellow-300 text-customBrown-500 text-xs border border-customYellow-400 rounded-md p-1.5'>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.type === Tooltip.Content) {
                return React.cloneElement(child)
              }
              return null
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

Tooltip.Trigger = TooltipTrigger
Tooltip.Content = TooltipContent

export default Tooltip
