import React from "react"
import { useTitle } from "@hooks/useTitle"

interface SelectUserProps {
  HeaderComponent?: React.FC
  FilterComponent?: React.FC
  TableComponent?: React.FC
  FooterComponent?: React.FC
  ActionComponent?: React.FC
  title: string
  className?: string
}

const SelectUser: React.FC<SelectUserProps> = ({
  HeaderComponent,
  FilterComponent,
  ActionComponent,
  TableComponent,
  FooterComponent,
  title,
  className,
}) => {
  useTitle(title)

  return (
    <div className={className}>
      {HeaderComponent != null && <HeaderComponent />}
      {FilterComponent != null && <FilterComponent />}
      {ActionComponent != null && <ActionComponent />}
      {TableComponent != null && <TableComponent />}
      {FooterComponent != null && <FooterComponent />}
    </div>
  )
}

export default SelectUser
