interface PageTitleProps {
  children: React.ReactNode
}

export const PageTitle = ({ children }: PageTitleProps) => {
  return (
    <pre className='font-sans break-words whitespace-pre-wrap'>
      <h1 className='text-primary-500 text-base md:text-2xl font-bold'>{children}</h1>
    </pre>
  )
}
