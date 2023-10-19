import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { getEmployees } from "../../../../redux/slices/employeesSlice"
import { useAppDispatch } from "../../../../hooks/useAppDispatch"
import { useAppSelector } from "../../../../hooks/useAppSelector"
import { Input } from "../../../../components/input/Input"
import { Button, LinkButton } from "../../../../components/button/Button"
import { Checkbox } from "../../../../components/checkbox/Checkbox"
import { setSelectedEmployeeIds } from "../../../../redux/slices/evaluationSlice"
import { CustomSelect } from "../../../../components/select/CustomSelect"
import { ModalPopup } from "../../../../components/modal/Modal"
import { Icon } from "../../../../components/icon/Icon"
import { Pagination } from "../../../../components/pagination/Pagination"
import { type Option } from "../../../../types/optionType"

const filterOptions: Option[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Probationary",
    value: "probationary",
  },
  {
    label: "Regular",
    value: "regular",
  },
  {
    label: "Intern",
    value: "intern",
  },
]

export const SelectEmployeesForm = () => {
  const { id } = useParams()
  const appDispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { selectedEmployeeIds } = useAppSelector((state) => state.evaluation)
  const { employees, hasPreviousPage, hasNextPage, totalPages } =
    useAppSelector((state) => state.employees)
  const [name, setName] = useState<string>(searchParams.get("name") ?? "")
  const [employee_type, setEmployeeType] = useState<string>(
    searchParams.get("status") ?? "all"
  )

  const [show_cancel_modal, setShowCancelModal] = useState<boolean>(false)
  const [show_back_modal, setShowBackModal] = useState<boolean>(false)

  useEffect(() => {
    void appDispatch(getEmployees())
  }, [])

  useEffect(() => {
    void appDispatch(
      getEmployees({
        name: searchParams.get("name") ?? undefined,
        user_type: searchParams.get("user_type") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      })
    )
  }, [searchParams])

  const handleSearch = async () => {
    if (name.length !== 0) {
      searchParams.set("name", name)
    }
    searchParams.set("user_type", employee_type)
    searchParams.set("page", "1")
    setSearchParams(searchParams)
  }

  const handleClear = async () => {
    setName("")
    setEmployeeType("all")
    setSearchParams({})
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const employeeIds = employees.map((employee) => employee.id)
      appDispatch(setSelectedEmployeeIds(employeeIds))
    } else {
      appDispatch(setSelectedEmployeeIds(""))
    }
  }

  const handleClickCheckbox = (checked: boolean, employeeId: number) => {
    if (checked) {
      appDispatch(setSelectedEmployeeIds([...selectedEmployeeIds, employeeId]))
    } else {
      appDispatch(
        setSelectedEmployeeIds(
          selectedEmployeeIds.filter((id) => id !== employeeId)
        )
      )
    }
  }

  const handleShowCancelModal = () => {
    setShowCancelModal(true)
  }

  const handleShowBackModal = () => {
    setShowBackModal(true)
  }

  const closePopup = () => {
    setShowCancelModal(false)
    setShowBackModal(false)
  }

  return (
    <div className='h-[calc(100vh_-_104px)] flex flex-col gap-4'>
      <h1 className='text-lg font-bold'>Select Employees</h1>
      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <Input
            label='Name/Email'
            name='search'
            placeholder='Search name or email'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <CustomSelect
            label='Employee Type'
            name='employee-type'
            value={filterOptions.find(
              (option) => option.value === employee_type
            )}
            onChange={(option) =>
              setEmployeeType(option !== null ? option.value : "all")
            }
            options={filterOptions}
          />
        </div>
        <div className='flex items-end gap-4'>
          <Button onClick={handleSearch}>Search</Button>
          <Button variant='destructive' onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>
      <div className='flex-1 bg-gray-100 overflow-y-scroll'>
        <table className='relative w-full'>
          <thead className='sticky top-0 bg-white text-left'>
            <tr>
              <th>
                <Checkbox onChange={(checked) => handleSelectAll(checked)} />
              </th>
              <th>Name</th>
              <th>Date Started</th>
              <th>Position</th>
              <th>Employee Type</th>
            </tr>
          </thead>
          <tbody>
            {employees?.map((employee) => (
              <tr key={employee?.id}>
                <td>
                  <div className='w-fit'>
                    <Checkbox
                      checked={selectedEmployeeIds.includes(employee?.id)}
                      onChange={(checked) =>
                        handleClickCheckbox(checked, employee?.id)
                      }
                    />
                  </div>
                </td>
                <td>
                  {employee?.first_name} {employee?.last_name}
                </td>
                <td>{employee?.user_details.start_date?.split("T")[0]}</td>
                <td>{employee?.user_details.user_position}</td>
                <td>{employee?.user_details.user_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex justify-between'>
        <Button variant='primaryOutline' onClick={handleShowCancelModal}>
          Cancel & Exit
        </Button>
        <div className='flex items-center'>
          <Button
            variant='primaryOutline'
            size='medium'
            onClick={handleShowBackModal}
          >
            <Icon icon='ChevronLeft' />
          </Button>
          <div className='ml-2'></div>
          <LinkButton to={`/admin/evaluations/${id}/preview`}>
            Check & Preview
          </LinkButton>
        </div>
        <ModalPopup
          show={show_cancel_modal}
          title='Cancel & Exit'
          proceed='/admin/evaluations'
          handleClose={closePopup}
          type='cancel-modal'
        />
        <ModalPopup
          show={show_back_modal}
          title='Go back to previous step'
          proceed={`/admin/evaluations/${id}`}
          handleClose={closePopup}
          type='back-modal'
        />
      </div>
      <div className='flex justify-center'>
        <Pagination
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  )
}
