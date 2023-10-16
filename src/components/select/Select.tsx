interface Option {
  label: string
  value: string
}

interface SelectProps {
  label?: string
  name: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  options: Option[]
}

export const Select = ({ label, name, onChange, options }: SelectProps) => {
  return (
    <div className='flex flex-col'>
      {label != null && (
        <label className='font-medium' htmlFor={name}>
          {label}
        </label>
      )}
      <select
        className='border px-4 py-2.5 rounded-md'
        name={name}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
