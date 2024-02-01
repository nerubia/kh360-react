interface PageSubTitleProps {
  children: React.ReactNode
}

export const PageSubTitle = ({ children }: PageSubTitleProps) => {
  return <h2 className='text-primary-500 text-sm font-bold xl:text-lg'>{children}</h2>
}
