import { useAppSelector } from "@hooks/useAppSelector"
import { useAppDispatch } from "@hooks/useAppDispatch"
import { useAdmin } from "@hooks/useAdmin"
import { removeAllAlert, setActiveSidebar, setAutoClose } from "@redux/slices/app-slice"
import { logout } from "@redux/slices/auth-slice"
import { Icon } from "@components/ui/icon/icon"
import { Button } from "@components/ui/button/button"
import { Menu } from "@components/shared/Menu"
import { type icons } from "@components/ui/icon/icons"
import { useInternalUser } from "@hooks/use-internal-user"
import { useCmUser } from "@hooks/use-cm-user"
import { useLocation, useParams } from "react-router-dom"
import { useMobileView } from "@hooks/use-mobile-view"
import { routes } from "@routes/routes"
import { Suspense, useEffect, useState } from "react"
import { setCheckedUserSkills, setSelectedUserSkills } from "@redux/slices/user-skills-slice"
import { setUserSkillMapRatings } from "@redux/slices/user-slice"
import { multipleAlertPath } from "../../../utils/mutiple-alert-path"
interface MenuLink {
  title: string
  link: string
  icon: string
  access: string
  children?: MenuLink[]
}

const menuLinks: MenuLink[] = [
  /* {
    title: "Sample",
    link: "/sample",
    access: "Admin",
  },
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: "Dashboard",
    access: "Internal",
  }, */
  {
    title: "My Evaluations",
    link: routes.private.internalUser.myEvaluations,
    icon: "ClipboardCheck",
    access: "Internal",
  },
  {
    title: "Evaluation Forms",
    link: routes.private.userEvaluationAdministrations,
    icon: "FileText",
    access: "Public",
  },
  {
    title: "Evaluation Results",
    link: routes.private.cmUser.evaluationResultsList,
    icon: "ListChecks",
    access: "Bod",
  },
  {
    title: "Survey Forms",
    link: routes.private.internalUser.surveyForms,
    icon: "Clipboard",
    access: "Internal",
  },
  {
    title: "My Skill Map",
    link: routes.private.internalUser.mySkillMap,
    icon: "LineChart",
    access: "Internal",
  },
  {
    title: "Skill Map Forms",
    link: routes.private.internalUser.skillMapForms,
    icon: "BrainCircuit",
    access: "Internal",
  },
  {
    title: "Evaluation Admin",
    link: routes.private.admin.evaluationAdministrations,
    icon: "UserRoundCog",
    access: "Admin",
    children: [
      {
        title: "Evaluation Admin List",
        link: routes.private.admin.evaluationAdministrations,
        icon: "PenSquare",
        access: "Admin",
      },
      {
        title: "External Evaluators",
        link: routes.private.admin.externalEvaluators,
        icon: "UserFill",
        access: "Admin",
      },
      {
        title: "Evaluation Templates",
        link: routes.private.admin.evaluationTemplates,
        icon: "List",
        access: "Admin",
      },
    ],
  },
  {
    title: "Skill Map Admin",
    link: routes.private.admin.skillMapAdministrations,
    icon: "UserRoundCog",
    access: "Admin",
    children: [
      {
        title: "Skill Map Admin List",
        link: routes.private.admin.skillMapAdministrations,
        icon: "PenSquare",
        access: "Admin",
      },
      {
        title: "Skill Map Search",
        link: routes.private.admin.skillMapSearch,
        icon: "SearchCheck",
        access: "Admin",
      },
      {
        title: "Skill Map Results",
        link: routes.private.admin.skillMapResults,
        icon: "FileLineChart",
        access: "Admin",
      },
    ],
  },
  {
    title: "Project Admin",
    link: routes.private.admin.projects,
    icon: "UserRoundCog",
    access: "Admin",
    children: [
      {
        title: "Project List",
        link: routes.private.admin.projects,
        icon: "Target",
        access: "Admin",
      },
      {
        title: "Project Assignments",
        link: routes.private.admin.projectAssignments,
        icon: "GanttChart",
        access: "Admin",
      },
    ],
  },
  {
    title: "KH360 Admin",
    link: routes.private.admin.emailTemplates,
    icon: "UserRoundCog",
    access: "Admin",
    children: [
      {
        title: "Message Templates",
        link: routes.private.admin.emailTemplates,
        icon: "Message",
        access: "Admin",
      },
      {
        title: "Skill Categories",
        link: routes.private.admin.skillCategories,
        icon: "Stack",
        access: "Admin",
      },
      {
        title: "Skills",
        link: routes.private.admin.skills,
        icon: "Shapes",
        access: "Admin",
      },
    ],
  },
  {
    title: "Survey Admin",
    link: routes.private.admin.surveyAdministrations,
    icon: "UserRoundCog",
    access: "Admin",
    children: [
      {
        title: "Survey Admin List",
        link: routes.private.admin.surveyAdministrations,
        icon: "ClipboardList",
        access: "Admin",
      },
      {
        title: "Survey Results",
        link: routes.private.admin.surveyResults,
        icon: "PieChart",
        access: "Admin",
      },
    ],
  },
]

export const Sidebar = () => {
  const location = useLocation()
  const { id } = useParams()
  const { activeSidebar, autoClose } = useAppSelector((state) => state.app)

  const { user } = useAppSelector((state) => state.auth)
  const appDispatch = useAppDispatch()
  const isInternal = useInternalUser()
  const isAdmin = useAdmin()
  const isCm = useCmUser()

  const isMobileView = useMobileView()
  const isMediumSize = useMobileView(1028)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (location.pathname !== `${multipleAlertPath[0]}` + id) {
      if (autoClose === false) {
        appDispatch(removeAllAlert())
        appDispatch(setAutoClose(true))
      }
    }
  }, [location.pathname])

  const toggleSidebar = () => {
    appDispatch(setActiveSidebar(!activeSidebar))
  }

  const handleLogout = async () => {
    await appDispatch(logout())
  }

  const isParentActive = (menuLink: MenuLink) => {
    if (menuLink.children !== undefined) {
      for (const child of menuLink.children) {
        if (location.pathname.includes(child.link)) {
          return true
        }
      }
    }
    return false
  }

  const toggleMenuState = (title: string) => {
    setOpenMenus((prevOpenMenus) => ({
      ...prevOpenMenus,
      [title]: !prevOpenMenus[title],
    }))
  }

  return (
    <div
      className={`${
        activeSidebar ? (isMediumSize ? "w-full md:w-44" : "w-full md:w-64") : "w-64 -ml-64"
      } bg-primary-500 fixed z-50 h-screen transition-all duration-300`}
    >
      <div className='relative flex flex-col h-full gap-4 p-5 overflow-y-auto'>
        <div className='absolute block top-5 md:hidden'>
          <Button testId='SidebarCloseButton' variant='ghost' size='small' onClick={toggleSidebar}>
            <Icon icon='Close' size={isMediumSize ? "extraSmall" : "medium"} />
          </Button>
        </div>
        <div className='flex justify-center'>
          <img className='h-20 rounded-full ' src='/logo.png' />
        </div>
        <h1 className='text-lg font-bold text-center text-white'>
          {user?.first_name} {user?.last_name}
        </h1>
        <div
          className='flex flex-col flex-1 gap-2'
          onClick={isMobileView ? toggleSidebar : undefined}
        >
          {menuLinks.map(
            (menu, index) =>
              ((isInternal && menu.access === "Internal") ||
                (isAdmin && menu.access === "Admin") ||
                (isCm && menu.access === "Bod") ||
                menu.access === "Public") && (
                <div
                  key={index}
                  className='flex flex-col gap-2'
                  onClick={() => {
                    appDispatch(setSelectedUserSkills([]))
                    appDispatch(setCheckedUserSkills([]))
                    appDispatch(setUserSkillMapRatings([]))
                    return menu.children !== undefined ? toggleMenuState(menu.title) : null
                  }}
                >
                  <Menu
                    to={menu.link}
                    isEvaluation={false}
                    className={`w-full rounded-md flex justify-between items-center bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 disabled:bg-primary-200 [&.active]:bg-primary-700 [&.active]:cursor-default h-9 px-4 ${
                      isParentActive(menu) ? "!bg-primary-700 p-6" : ""
                    } ${
                      menu.title === "Evaluation Admin" && isMediumSize
                        ? "p-6"
                        : menu.title === "Evaluation Admin"
                        ? "whitespace-nowrap"
                        : ""
                    }`}
                  >
                    <div
                      className={isMediumSize ? "text-xs flex gap-2 items-center" : "flex gap-2"}
                    >
                      {menu.icon != null && (
                        <Icon
                          size={isMediumSize ? "extraSmall" : "medium"}
                          icon={menu.icon as keyof typeof icons}
                        />
                      )}
                      {menu.title}
                    </div>
                    <Suspense fallback={null}>
                      {menu.children !== undefined ? (
                        openMenus[menu.title] ? (
                          <Icon size={isMediumSize ? "extraSmall" : "medium"} icon='ChevronUp' />
                        ) : (
                          <Icon size={isMediumSize ? "extraSmall" : "medium"} icon='ChevronRight' />
                        )
                      ) : null}
                    </Suspense>
                  </Menu>
                  <div className={openMenus[menu.title] ? "" : "hidden"}>
                    {menu.children?.map((child, i) => (
                      <div key={i} className='ml-2 pb-1' onClick={(e) => e.stopPropagation()}>
                        <Menu
                          to={child.link}
                          isEvaluation={false}
                          className='w-full rounded-md flex items-center gap-2 bg-primary-500 text-sm text-white hover:bg-primary-600 active:bg-primary-700 disabled:bg-primary-200 [&.active]:bg-primary-700 [&.active]:cursor-default px-4 py-2'
                        >
                          {child.icon != null && (
                            <Icon
                              size={isMediumSize ? "extraSmall" : "medium"}
                              icon={child.icon as keyof typeof icons}
                            />
                          )}
                          <div className={isMediumSize ? "text-xs" : ""}>{child.title}</div>
                        </Menu>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
          <Button fullWidth center={false} onClick={handleLogout}>
            <Icon size={isMediumSize ? "extraSmall" : "medium"} icon='Logout' />
            <div className={isMediumSize ? "text-xs" : ""}>Logout</div>
          </Button>
        </div>
      </div>
    </div>
  )
}
