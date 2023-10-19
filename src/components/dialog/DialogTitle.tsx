interface DialogTitleProps {
  children: React.ReactNode
}

export const DialogTitle = ({ children }: DialogTitleProps) => {
  return <h1 className='text-2xl font-bold'>{children}</h1>
}
