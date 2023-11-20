import React, { useEffect, useRef, useState } from "react"
import { DropdownContent } from "./dropdown-content"
import { DropdownItem } from "./dropdown-item"
import { DropdownTrigger } from "./dropdown-trigger"

interface DropdownProps {
  children: React.ReactNode
}

function Dropdown({ children }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [])

  const handleClick = (event: MouseEvent) => {
    if (dropdownRef.current != null && !dropdownRef.current?.contains(event.target as Node)) {
      setOpen(false)
      return
    }
    if (triggerRef.current?.contains(event.target as Node) === true) {
      setOpen((prev) => !prev)
      return
    }
    if ((event.target as HTMLElement).getAttribute("data-dropdown-item") != null) {
      setOpen(false)
    }
  }

  return (
    <div ref={dropdownRef} className='relative w-fit'>
      <div ref={triggerRef}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === Dropdown.Trigger) {
            return React.cloneElement(child)
          }
          return null
        })}
      </div>
      {open &&
        React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === Dropdown.Content) {
            return React.cloneElement(child)
          }
          return null
        })}
    </div>
  )
}

Dropdown.Trigger = DropdownTrigger
Dropdown.Content = DropdownContent
Dropdown.Item = DropdownItem

export default Dropdown
