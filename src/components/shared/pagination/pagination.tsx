import { useSearchParams } from "react-router-dom"
import { Button } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"

interface PaginationProps {
  hasPreviousPage: boolean
  hasNextPage: boolean
  totalPages: number
}

export const Pagination = ({ hasPreviousPage, hasNextPage, totalPages }: PaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = searchParams.get("page")
  const currentPage = page !== null ? parseInt(page) : 1

  return currentPage > 0 && currentPage <= totalPages ? (
    <div className='flex flex-col items-center gap-4'>
      <div className='flex gap-2'>
        <Button
          size='small'
          onClick={() => {
            let targetPage = 1
            if (currentPage - 10 > 1) {
              targetPage = currentPage - 10
            }
            searchParams.set("page", targetPage.toString())
            setSearchParams(searchParams)
          }}
          disabled={!hasPreviousPage}
        >
          <Icon icon='ChevronsLeft' size='small' />
        </Button>
        <Button
          size='small'
          onClick={() => {
            const targetPage = currentPage - 1
            searchParams.set("page", targetPage.toString())
            setSearchParams(searchParams)
          }}
          disabled={!hasPreviousPage}
        >
          <Icon icon='ChevronLeft' size='small' />
        </Button>
        <Button
          size='small'
          onClick={() => {
            const targetPage = currentPage + 1
            searchParams.set("page", targetPage.toString())
            setSearchParams(searchParams)
          }}
          disabled={!hasNextPage}
        >
          <Icon icon='ChevronRight' size='small' />
        </Button>
        <Button
          size='small'
          onClick={() => {
            let targetPage = totalPages
            if (currentPage + 10 < totalPages) {
              targetPage = currentPage + 10
            }
            searchParams.set("page", targetPage.toString())
            setSearchParams(searchParams)
          }}
          disabled={!hasNextPage}
        >
          <Icon icon='ChevronsRight' size='small' />
        </Button>
      </div>
      <p className='text-sm'>
        Page {currentPage} of {totalPages}
      </p>
    </div>
  ) : null
}
