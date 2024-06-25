import { Button } from "@components/ui/button/button"
import Dropdown from "@components/ui/dropdown/dropdown"
import { Icon } from "@components/ui/icon/icon"
import { useMobileView } from "@hooks/use-mobile-view"
import { useAppSelector } from "@hooks/useAppSelector"
import { useNavigate } from "react-router-dom"

export const SkillMapAdministrationsAction = () => {
  const navigate = useNavigate()
  const isMobile = useMobileView()

  const { totalItems } = useAppSelector((state) => state.skillMapAdministrations)

  return (
    <div className='flex flex-col items-center md:flex-row justify-between gap-4'>
      <h2 className='text-gray-400'>
        {totalItems} {totalItems === 1 ? "Result" : "Results"} Found
      </h2>
      <Dropdown>
        <Dropdown.Trigger>
          <Button size={isMobile ? "small" : "medium"}>
            <div className='whitespace-nowrap'>Create Skill Map</div>
            <Icon icon='ChevronDown' size={isMobile ? "small" : "medium"} />
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content size={isMobile ? "small" : "medium"}>
          <Dropdown.Item onClick={() => navigate(`/admin/skill-map-administrations/create`)}>
            Administer Skill Map
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate(`/admin/skill-map-administrations/upload`)}>
            Upload Skill Map
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </div>
  )
}
