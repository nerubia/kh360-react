interface DropdownTriggerProps {
  children: React.ReactNode
}

export const DropdownTrigger = ({ children }: DropdownTriggerProps) => {
  return <div data-dropdown-trigger>{children}</div>
}
