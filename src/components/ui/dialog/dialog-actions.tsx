interface DialogActionsProps {
  children: React.ReactNode
}

export const DialogActions = ({ children }: DialogActionsProps) => {
  return <div className='flex gap-4 justify-end'>{children}</div>
}
