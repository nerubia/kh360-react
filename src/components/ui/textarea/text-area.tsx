interface TextAreaInterface {
  label?: string
  name: string
  placeholder: string
  value?: string
  error?: string | null
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void
  disabled?: boolean
  autoFocus?: boolean
  maxLength?: number
  rows?: number
}

export const TextArea = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  autoFocus,
  maxLength,
  rows,
}: TextAreaInterface) => {
  return (
    <div className='flex flex-col'>
      {label != null && (
        <label className='font-medium' htmlFor={name}>
          {label}
        </label>
      )}
      <textarea
        className={`${
          error != null ? "border-red-500" : ""
        } w-full p-4 border rounded-md resize-none`}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        rows={rows ?? 5}
        disabled={disabled}
        autoFocus={autoFocus}
        maxLength={maxLength}
      ></textarea>
      {error != null && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  )
}
