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
    HiOutlineHashtag,
    HiOutlineClipboardCheck,
    HiOutlineUserAdd,
    HiOutlineOfficeBuilding,
    HiOutlineUserCircle,
    HiOutlineCurrencyDollar,
    HiOutlineGlobe,
    HiOutlineRefresh,
    HiOutlineDatabase,
    HiOutlineCollection,
    HiOutlineChartBar,
    HiOutlineLightningBolt,
    HiOutlineDocumentAdd,
    HiOutlineReceiptRefund,
    HiOutlineChartPie,
    HiOutlineCash,
    HiOutlineTrendingUp,
} from 'react-icons/hi'
import type { JSX } from 'react'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    // === ICONOS BÁSICOS ===
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
    percentage: <HiOutlineHashtag />,
    presupuesto: <HiOutlineClipboardCheck />,
    
    // === ICONOS PARA CATÁLOGOS ===
    database: <HiOutlineDatabase />,
    package: <HiOutlineCollection />,
    chartBar: <HiOutlineChartBar />,
    
    // === ICONOS PARA OPERACIONES RÁPIDAS ===
    lightning: <HiOutlineLightningBolt />,
    userAdd: <HiOutlineUserAdd />,
    buildingAdd: <HiOutlineOfficeBuilding />,
    documentAdd: <HiOutlineDocumentAdd />,
    receiptAdd: <HiOutlineReceiptRefund />,
    userPlus: <HiOutlineUserCircle />,
    
    // === ICONOS PARA FACTURACIÓN ===
    receiptTax: <HiOutlineReceiptTax />,
    
    // === ICONOS PARA FINANZAS ===
    chartLine: <HiOutlineChartPie />,
    cash: <HiOutlineCash />,
    trendingUp: <HiOutlineTrendingUp />,
    
    // === ICONOS PARA CONFIGURACIÓN ===
    currency: <HiOutlineCurrencyDollar />,
    exchange: <HiOutlineRefresh />,
    globe: <HiOutlineGlobe />,
    
    // === ICONOS DEL TEMPLATE ORIGINAL (mantener por compatibilidad) ===
    fileText: <HiOutlineClipboardCheck />,
    singleMenu: <HiOutlineViewGridAdd />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
}

export default navigationIcon
