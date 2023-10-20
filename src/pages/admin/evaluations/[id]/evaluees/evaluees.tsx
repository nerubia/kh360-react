import { Button } from "../../../../../components/button/Button"
import { Icon } from "../../../../../components/icon/Icon"
import { Pagination } from "../../../../../components/pagination/Pagination"
import { EvalueeList } from "../../../../../features/admin/evaluations/[id]/evaluees/EvalueeList"
import { EvalueesFilter } from "../../../../../features/admin/evaluations/[id]/evaluees/EvalueesFilter"
import { EvalueesHeader } from "../../../../../features/admin/evaluations/[id]/evaluees/EvalueesHeader"
import { useAppSelector } from "../../../../../hooks/useAppSelector"

export default function Evaluees() {
  const { hasPreviousPage, hasNextPage, totalPages } = useAppSelector(
    (state) => state.evaluees
  )

  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-8'>
      <EvalueesFilter />
      <EvalueesHeader />
      <EvalueeList />
      <div className='flex justify-center'>
        <Pagination
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          totalPages={totalPages}
        />
      </div>
      <div className='flex justify-between'>
        <Button variant='primaryOutline'>Cancel & Exit</Button>
        <div className='flex items-center'>
          <Button testId='BackButton' variant='primaryOutline'>
            <Icon icon='ChevronLeft' />
          </Button>
          <div className='ml-2'></div>
          <Button variant='primaryOutline' disabled>
            Generate Evaluations
          </Button>
        </div>
      </div>
    </div>
  )
}
