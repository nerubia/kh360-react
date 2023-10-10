import { createElement } from "react"
import { icons } from "./icons"

interface IconProps {
  icon: keyof typeof icons
}

export const Icon = ({ icon }: IconProps) => {
  return <div>{createElement(icons[icon])}</div>
}
