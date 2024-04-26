import { PageTitle } from "@components/shared/page-title"

interface SelectUsersHeaderProps {
  title: string
}

export const SelectUsersHeader = ({ title }: SelectUsersHeaderProps) => {
  return (
    <div>
      <PageTitle>{title}</PageTitle>
    </div>
  )
}
