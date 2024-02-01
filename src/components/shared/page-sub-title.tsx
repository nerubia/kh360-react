interface PageSubTitleProps {
  children: React.ReactNode
}

export const PageSubTitle = ({ children }: PageSubTitleProps) => {
  return <h2 className='text-primary-500 text-xs font-bold xl:text-lg'>{children}</h2>
}
