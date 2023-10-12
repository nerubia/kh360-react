interface TextAreaInterface {
  label?: string
  name: string
  placeholder: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export const TextArea = ({
  label,
  name,
  placeholder,
  onChange,
}: TextAreaInterface) => {
  return (
    <div className='flex flex-col'>
      {label != null && (
        <label className='font-medium' htmlFor={name}>
          {label}
        </label>
      )}
      <textarea
        className='w-full p-4 border rounded-md resize-none'
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        rows={5}
      ></textarea>
    </div>
  )
}
