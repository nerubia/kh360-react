interface TextAreaInterface {
  name: string
  placeholder: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export const TextArea = ({
  name,
  placeholder,
  onChange,
}: TextAreaInterface) => {
  return (
    <textarea
      className='w-full p-4 border rounded-md'
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      rows={5}
    ></textarea>
  )
}
