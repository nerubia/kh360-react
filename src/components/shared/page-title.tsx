interface PageTitleProps {
  children: React.ReactNode
}

export const PageTitle = ({ children }: PageTitleProps) => {
  return <h1 className='text-primary-500 text-base md:text-2xl font-bold'>{children}</h1>
}
