import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiOutlineUsers,
    HiOutlineCube,
    HiOutlineDocumentText,
    HiOutlineBriefcase,
    HiOutlineUserGroup,
    HiOutlineTruck,
    HiOutlineCog,
    HiOutlineCalculator,
    HiOutlineReceiptTax,
    HiOutlineClipboardList,
    HiOutlineHashtag, // Usamos este en lugar de HiOutlinePercent
} from 'react-icons/hi'
import type { JSX } from 'react'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    users: <HiOutlineUsers />,
    product: <HiOutlineCube />,
    document: <HiOutlineDocumentText />,
    briefcase: <HiOutlineBriefcase />,
    userGroup: <HiOutlineUserGroup />,
    truck: <HiOutlineTruck />,
    cog: <HiOutlineCog />,
    calculator: <HiOutlineCalculator />,
    invoice: <HiOutlineReceiptTax />,
    receipt: <HiOutlineClipboardList />,
    percentage: <HiOutlineHashtag />, // Cambiado a HiOutlineHashtag
    // Iconos del template original (mantener por compatibilidad)
    singleMenu: <HiOutlineViewGridAdd />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
}

export default navigationIcon
