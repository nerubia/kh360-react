import { PageTitle } from "../../../../components/shared/page-title"

interface EmailTemplateHeaderProps {
  title: string
}
export const EmailTemplateHeader = ({ title }: EmailTemplateHeaderProps) => {
  return <PageTitle>{title}</PageTitle>
}
