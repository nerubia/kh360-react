import { useEffect, useState } from "react"

interface ToggleSwitchProps {
  checked?: boolean
  disabled?: boolean
  onChange: (value: boolean) => void
}

export const ToggleSwitch = ({ checked, disabled, onChange }: ToggleSwitchProps) => {
  const [isChecked, setIsChecked] = useState(checked ?? false)

  useEffect(() => {
    setIsChecked(checked ?? false)
  }, [checked])

  return (
    <div className='relative flex flex-col justify-center overflow-hidden'>
      <div className='flex'>
        <label className='inline-flex relative items-center mr-4 cursor-pointer'>
          <input
            type='checkbox'
            className='sr-only peer'
            checked={isChecked}
            disabled={disabled}
            readOnly
          />
          <div
            onClick={() => {
              const newCheckedState = !isChecked
              setIsChecked(newCheckedState)
              onChange(newCheckedState)
            }}
            className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-primary-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"
          ></div>
        </label>
      </div>
    </div>
  )
}
