interface DialogDescriptionProps {
  children: React.ReactNode
}

export const DialogDescription = ({ children }: DialogDescriptionProps) => {
  return <div className='overflow-auto'>{children}</div>
}
