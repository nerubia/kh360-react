import { useEffect, useState } from "react"

interface CheckboxProps {
  checked?: boolean
  onChange: (value: boolean) => void
}

export const Checkbox = ({ checked, onChange }: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked ?? false)

  useEffect(() => {
    setIsChecked(checked ?? false)
  }, [checked])

  return (
    <input
      type='checkbox'
      checked={isChecked}
      onChange={() => {
        const newCheckedState = !isChecked
        setIsChecked(newCheckedState)
        onChange(newCheckedState)
      }}
    />
  )
}
