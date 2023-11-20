interface DropdownContentProps {
  children: React.ReactNode
}

export const DropdownContent = ({ children }: DropdownContentProps) => {
  return (
    <div className='absolute right-0 z-50 w-60 pt-1'>
      <div className='bg-white flex flex-col gap-1 border rounded-md shadow-md p-1'>{children}</div>
    </div>
  )
}
