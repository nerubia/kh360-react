import { convertToFullDate, shortenFormatDate } from "@utils/format-date"

interface DateRangeDisplayProps {
  label: string
  startDate?: string
  endDate?: string
  isMobile: boolean
}

export const DateRangeDisplay = ({
  label,
  startDate,
  endDate,
  isMobile,
}: DateRangeDisplayProps) => (
  <div className='flex gap-3'>
    <div className='font-bold'>
      {!isMobile ? <span>{label}</span> : <span>{label.trim().split(" ")[1]}</span>}:
    </div>
    {isMobile ? shortenFormatDate(startDate) : convertToFullDate(startDate)} to{" "}
    {isMobile ? shortenFormatDate(endDate) : convertToFullDate(endDate)}
  </div>
)
