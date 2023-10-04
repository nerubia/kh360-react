interface ButtonProps {
  name: string
  onClick: () => void
  loading?: boolean
}

export const Button = ({ name, onClick, loading }: ButtonProps) => {
  return (
    <button
      className='bg-blue-500 text-white px-4 py-2 rounded-md'
      onClick={onClick}
      disabled={loading}
    >
      {loading === true ? "Loading" : name}
    </button>
  )
}
