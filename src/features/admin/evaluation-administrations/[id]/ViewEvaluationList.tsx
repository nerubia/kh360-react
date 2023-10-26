import { useState } from "react"
import { Icon } from "../../../../components/icon/Icon"

export const ViewEvaluationList = () => {
  const toggleEmployeeDetails = (index: number) => {
    const updatedOpenEmployeeDetails: boolean[] = [...openEmployeeDetails]
    updatedOpenEmployeeDetails[index] = !updatedOpenEmployeeDetails[index]
    setOpenEmployeeDetails(updatedOpenEmployeeDetails)
  }

  const toggleProjectDetails = (
    employeeIndex: number,
    projectIndex: number
  ) => {
    const updatedOpenProjectDetails: boolean[][] = [...openProjectDetails]
    updatedOpenProjectDetails[employeeIndex][projectIndex] =
      !updatedOpenProjectDetails[employeeIndex][projectIndex]
    setOpenProjectDetails(updatedOpenProjectDetails)
  }

  const employeesData = [
    {
      last_name: "Axe",
      first_name: "Emma",
      templates: [
        {
          name: "BOD Evaluation",
          start_date: "2023-01-01",
          end_date: "2023-05-31",
          evaluators: [
            {
              last_name: "Eve",
              first_name: "Aluator",
              role: "Dev",
              start_date: "2023-01-01",
              end_date: "2023-12-31",
              project_name: "KH360",
              percent_involvement: "10",
            },
            {
              last_name: "Eve",
              first_name: "Aluator2",
              role: "Dev",
              start_date: "2023-01-01",
              end_date: "2023-12-31",
              project_name: "KH360",
              percent_involvement: "50",
            },
          ],
        },
        {
          name: "DEV Evaluation",
          start_date: "2023-06-01",
          end_date: "2023-12-31",
          evaluators: [
            {
              last_name: "Eve",
              first_name: "Aluator",
              role: "Dev",
              start_date: "2023-01-01",
              end_date: "2023-12-31",
              project_name: "PHQ",
              percent_involvement: "20",
            },
            {
              last_name: "Eve",
              first_name: "Aluator2",
              role: "Dev",
              start_date: "2023-01-01",
              end_date: "2023-12-31",
              project_name: "iassess",
              percent_involvement: "30",
            },
          ],
        },
        {
          name: "Peer Evaluation",
          start_date: "2023-06-01",
          end_date: "2023-12-31",
          evaluators: [
            {
              last_name: "Eve",
              first_name: "Aluator",
              role: "Dev",
              start_date: "2023-01-01",
              end_date: "2023-12-31",
              project_name: "PHQ",
              percent_involvement: "10",
            },
            {
              last_name: "Eve",
              first_name: "Aluator2",
              role: "Dev",
              start_date: "2023-01-01",
              end_date: "2023-12-31",
              project_name: "PHQ",
              percent_involvement: "50",
            },
          ],
        },
      ],
    },
    {
      last_name: "Axe",
      first_name: "Emma",
      templates: [
        {
          name: "Project A",
          start_date: "2023-01-01",
          end_date: "2023-05-31",
          evaluators: [
            {
              last_name: "Eve",
              first_name: "Aluator",
              role: "Dev",
              start_date: "2023-01-01",
              end_date: "2023-12-31",
              project_name: "PHQ",
              percent_involvement: "20",
            },
            {
              last_name: "Eve",
              first_name: "Aluator2",
              role: "Dev",
              start_date: "2023-01-01",
              end_date: "2023-12-31",
              project_name: "PHQ",
              percent_involvement: "25",
            },
          ],
        },
        {
          name: "Template B",
          start_date: "2023-06-01",
          end_date: "2023-12-31",
        },
        {
          name: "Template C",
          start_date: "2023-06-01",
          end_date: "2023-12-31",
        },
      ],
    },
  ]

  const [openEmployeeDetails, setOpenEmployeeDetails] = useState<boolean[]>(
    Array(employeesData.length).fill(false)
  )
  const [openProjectDetails, setOpenProjectDetails] = useState<boolean[][]>(
    Array.from({ length: employeesData.length }, () => [false])
  )

  return (
    <>
      <div className='flex-1 flex flex-col gap-8 overflow-y-scroll overflow-x-hidden'>
        <div className='flex flex-col'>
          {employeesData.map((employee, employeeIndex) => (
            <div key={employeeIndex} className='mb-2'>
              <button
                onClick={() => toggleEmployeeDetails(employeeIndex)}
                className='text-sm'
              >
                <div className='flex items-center'>
                  <span className='text-xs'>
                    {openEmployeeDetails[employeeIndex] ? (
                      <Icon icon='ChevronDown' />
                    ) : (
                      <Icon icon='ChevronRight' />
                    )}
                  </span>
                  <span className='mr-1'>
                    {employee.last_name}, {employee.first_name}
                  </span>
                </div>
              </button>
              {openEmployeeDetails[employeeIndex] && (
                <div>
                  {employee.templates !== null
                    ? employee.templates.map((template, templateIndex) => (
                        <div key={templateIndex} className='mb-2 ml-4'>
                          <button
                            onClick={() =>
                              toggleProjectDetails(employeeIndex, templateIndex)
                            }
                            className='text-sm'
                          >
                            <div className='flex items-center'>
                              <span className='text-xs'>
                                {openProjectDetails[employeeIndex][
                                  templateIndex
                                ] ? (
                                  <Icon icon='ChevronDown' />
                                ) : (
                                  <Icon icon='ChevronRight' />
                                )}
                              </span>
                              <span className='mr-1'>{template.name}</span>
                            </div>
                          </button>
                          {openProjectDetails[employeeIndex][templateIndex] ? (
                            <table className='w-full ml-8'>
                              <thead className='sticky top-0 bg-white text-left'>
                                <tr>
                                  <th>Evaluator</th>
                                  <th>Project</th>
                                  <th>Role</th>
                                  <th>%</th>
                                  <th>Duration</th>
                                </tr>
                              </thead>
                              <tbody>
                                {template.evaluators !== undefined
                                  ? template.evaluators.map(
                                      (evaluator, evaluatorIndex) => (
                                        <tr key={evaluatorIndex}>
                                          <td>
                                            {evaluator.last_name},{" "}
                                            {evaluator.first_name}
                                          </td>
                                          <td>{evaluator.project_name}</td>
                                          <td>{evaluator.role}</td>
                                          <td>
                                            {evaluator.percent_involvement}%
                                          </td>
                                          <td>
                                            {evaluator.start_date} to{" "}
                                            {evaluator.end_date}
                                          </td>
                                        </tr>
                                      )
                                    )
                                  : null}
                              </tbody>
                            </table>
                          ) : null}
                        </div>
                      ))
                    : null}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
