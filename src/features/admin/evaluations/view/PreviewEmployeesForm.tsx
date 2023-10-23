import { useState } from "react"
import { Button, LinkButton } from "../../../../components/button/Button"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { useNavigate, useParams } from "react-router-dom"
import Dialog from "../../../../components/dialog/Dialog"
import { Icon } from "../../../../components/icon/Icon"
import { type User } from "../../../../types/userType"
import { createEvaluees } from "../../../../redux/slices/evaluationSlice"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export const PreviewEmployeesForm = () => {
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { allEmployees } = useAppSelector((state) => state.employees)
  const { selectedEmployeeIds } = useAppSelector((state) => state.evaluation)

  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [showIncluded, setShowIncluded] = useState(true)
  const [showExcluded, setShowExcluded] = useState(true)

  const toggleDialog = () => {
    setShowDialog((prev) => !prev)
  }

  const handleSubmit = async () => {
    try {
      const result = await appDispatch(
        createEvaluees({
          id,
          employee_ids: selectedEmployeeIds,
        })
      )
      if (typeof result.payload === "string") {
        toast.error(result.payload, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
      } else if (result.payload !== undefined) {
        navigate(`/admin/evaluations/${id}/evaluees`)
      }
    } catch (error) {}
  }

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-lg font-bold'>Review Employees</h1>
      <div className='flex-1 bg-white-100'>
        <table className='w-full table-fixed'>
          <thead className='sticky top-0 bg-white text-left'>
            <tr>
              <th className='w-20'></th>
              <th>Name</th>
              <th>Date Started</th>
              <th>Role</th>
              <th>Employee Type</th>
            </tr>
          </thead>
          <button
            onClick={() => setShowIncluded(!showIncluded)}
            className='text-sm p-1'
          >
            <div className='flex items-center'>
              <span className='mr-1'>Included</span>
              <span className='text-xs'>
                {showIncluded ? (
                  <Icon icon='ChevronDown' />
                ) : (
                  <Icon icon='ChevronUp' />
                )}
              </span>
            </div>
          </button>
          {showIncluded && (
            <tbody>
              {allEmployees.map((employee: User) =>
                selectedEmployeeIds.includes(employee.id) ? (
                  <tr key={employee.id}>
                    <td></td>
                    <td>
                      {employee.last_name}, {employee.first_name}
                    </td>
                    <td>{employee.user_details?.start_date?.split("T")[0]}</td>
                    <td>{employee.user_details?.user_position}</td>
                    <td>{employee.user_details?.user_type}</td>
                  </tr>
                ) : null
              )}
            </tbody>
          )}
        </table>
      </div>
      <div className='border-t border-gray-300 w-full'></div>
      <div className='flex-1 bg-white-100'>
        <button
          onClick={() => setShowExcluded(!showExcluded)}
          className='text-sm p-1'
        >
          <div className='flex items-center'>
            <span className='mr-1'>Excluded</span>
            <span className='text-xs'>
              {showExcluded ? (
                <Icon icon='ChevronDown' />
              ) : (
                <Icon icon='ChevronUp' />
              )}
            </span>
          </div>
        </button>
        {showExcluded && (
          <table className='w-full table-fixed'>
            <tbody>
              {allEmployees.map((employee: User) =>
                !selectedEmployeeIds.includes(employee.id) ? (
                  <tr key={employee.id}>
                    <td className='w-20'></td>
                    <td>
                      {employee.last_name}, {employee.first_name}
                    </td>
                    <td>{employee.user_details?.start_date?.split("T")[0]}</td>
                    <td>{employee.user_details?.user_position}</td>
                    <td>{employee.user_details?.user_type}</td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className='flex justify-between'>
        <Button variant='primaryOutline' onClick={toggleDialog}>
          Cancel & Exit
        </Button>
        <div className='flex items-center gap-2'>
          <LinkButton
            variant='primaryOutline'
            size='medium'
            to={`/admin/evaluations/${id}/select`}
          >
            <Icon icon='ChevronLeft' />
          </LinkButton>
          <div className='ml-2'></div>
          <Button onClick={handleSubmit}>Save & Proceed</Button>
        </div>
        <Dialog open={showDialog}>
          <Dialog.Title>Cancel & Exit</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to cancel and exit? <br />
            If you cancel, your data won&apos;t be saved.
          </Dialog.Description>
          <Dialog.Actions>
            <Button variant='primaryOutline' onClick={toggleDialog}>
              No
            </Button>
            <LinkButton variant='primary' to='/admin/evaluations'>
              Yes
            </LinkButton>
          </Dialog.Actions>
        </Dialog>
      </div>
      <ToastContainer />
    </div>
  )
}
