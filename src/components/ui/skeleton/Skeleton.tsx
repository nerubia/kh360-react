interface SkeletonProps {
  children?: React.ReactNode
  className?: string
}
export const Skeleton = ({ children, className }: SkeletonProps) => {
  return <div className={`bg-slate-100 rounded-md animate-pulse ${className}`}>{children}</div>
}
