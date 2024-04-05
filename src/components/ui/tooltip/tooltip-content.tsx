interface TooltipContentProps {
  children: React.ReactNode
  wFullOnMd?: boolean
}

export const TooltipContent = ({ children, wFullOnMd = true }: TooltipContentProps) => {
  return (
    <div className={`flex flex-col flex-wrap ${wFullOnMd ? "w-200 md:w-full" : "w-full"}`}>
      {children}
    </div>
  )
}
