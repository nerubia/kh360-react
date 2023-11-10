interface TextAreaInterface {
  label?: string
  name: string
  placeholder: string
  value?: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void
  error?: string
  disabled?: boolean
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
        rows={5}
        disabled={disabled}
      ></textarea>
      {error != null && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  )
}
