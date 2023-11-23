import { PageTitle } from "../../../../components/shared/PageTitle"

interface ExternalEvaluatorHeaderProps {
  title: string
}
export const ExternalEvaluatorHeader = ({ title }: ExternalEvaluatorHeaderProps) => {
  return <PageTitle>{title}</PageTitle>
}
