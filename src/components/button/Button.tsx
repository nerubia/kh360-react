interface ButtonProps {
  name: string
  onClick: () => void
}

export const Button = ({ name, onClick }: ButtonProps) => {
  return (
    <button
      className='bg-blue-500 text-white px-4 py-2 rounded-md'
      onClick={onClick}
    >
      {name}
    </button>
  )
}
