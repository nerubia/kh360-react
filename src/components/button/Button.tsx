interface ButtonProps {
  name: string
}

export const Button = ({ name }: ButtonProps) => {
  return (
    <button className='bg-blue-500 text-white px-4 py-2 rounded-md'>
      {name}
    </button>
  )
}
