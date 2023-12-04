import { PageTitle } from "../../../../components/shared/page-title"

interface ExternalEvaluatorHeaderProps {
  title: string
}
export const ExternalEvaluatorHeader = ({ title }: ExternalEvaluatorHeaderProps) => {
  return <PageTitle>{title}</PageTitle>
}
