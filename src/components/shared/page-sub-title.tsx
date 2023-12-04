interface PageSubTitleProps {
  children: React.ReactNode
}

export const PageSubTitle = ({ children }: PageSubTitleProps) => {
  return <h2 className='text-primary-500 text-lg font-bold'>{children}</h2>
}
