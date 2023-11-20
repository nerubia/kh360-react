interface DropdownItemProps {
  children: React.ReactNode
  onClick?: () => void
}

export const DropdownItem = ({ children, onClick }: DropdownItemProps) => {
  return (
    <button
      data-dropdown-item
      className='flex items-center gap-2 rounded-md hover:bg-gray-100 active:bg-gray-200 h-9 text-base px-4'
      onClick={onClick}
    >
      {children}
    </button>
  )
}
