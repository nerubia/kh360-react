interface ProgressProps {
  value: number
}

export const Progress = ({ value }: ProgressProps) => {
  return (
    <div className='bg-slate-200 w-full h-5 md:w-96 rounded-full'>
      <div className='bg-primary-500 h-full rounded-full' style={{ width: `${value}%` }}></div>
    </div>
  )
}
