import { createElement } from "react"
import { icons } from "./icons"

type IconName = keyof typeof icons

interface IconProps {
  icon: IconName
}

export const Icon = ({ icon }: IconProps) => {
  return <div>{createElement(icons[icon])}</div>
}
