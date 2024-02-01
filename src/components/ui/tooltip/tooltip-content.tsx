interface TooltipContentProps {
  children: React.ReactNode
}

export const TooltipContent = ({ children }: TooltipContentProps) => {
  return <div className='flex flex-col flex-wrap w-200 md:w-full'>{children}</div>
}
