import { useEffect, useState } from "react"

interface CheckboxProps {
  checked?: boolean
  disabled?: boolean
  onChange: (value: boolean) => void
}

export const Checkbox = ({ checked, disabled, onChange }: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked ?? false)

  useEffect(() => {
    setIsChecked(checked ?? false)
  }, [checked])

  return (
    <input
      type='checkbox'
      checked={isChecked}
      disabled={disabled}
      onChange={() => {
        const newCheckedState = !isChecked
        setIsChecked(newCheckedState)
        onChange(newCheckedState)
      }}
    />
  )
}
