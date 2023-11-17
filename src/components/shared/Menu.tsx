import { type Evaluation } from "../../types/evaluationType"
import { NavLink } from "react-router-dom"

interface MenuProps {
  evaluation?: Evaluation
  evaluation_id?: string
  is_editing?: boolean
  to: string
  testId?: string
  isAdmin?: boolean
  isEvaluation: boolean
  children: React.ReactNode
  className: string
  onClick?: () => void
}

export const Menu = ({
  evaluation,
  evaluation_id,
  isAdmin,
  isEvaluation,
  to,
  testId,
  children,
  className,
  onClick,
}: MenuProps) => {
  const getButtonClass = () => {
    if (evaluation_id !== undefined && evaluation?.id === parseInt(evaluation_id)) {
      return "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 disabled:bg-primary-200"
    } else {
      return "text-black hover:bg-gray-100 active:bg-primary-500 [&.active]:bg-primary-500 [&.active]:text-white [&.active]:cursor-default"
    }
  }

  return (
    <>
      {isEvaluation ? (
        <button className={`${className} ${getButtonClass()}`} onClick={onClick}>
          {children}
        </button>
      ) : (
        isAdmin === true && (
          <NavLink data-testid={testId} to={to} className={className}>
            {children}
          </NavLink>
        )
      )}
    </>
  )
}
