import {
    MdHome,
    MdPeople,
    MdCategory,
    MdDescription,
    MdBusinessCenter,
    MdGroups,
    MdLocalShipping,
    MdSettings,
    MdCalculate,
    MdReceipt,
    MdListAlt,
    MdPercent,
    MdAssignmentTurnedIn,
    MdStorage,
    MdCollections,
    MdBarChart,
    MdFlashOn,
    MdPersonAdd,
    MdLocationCity,
    MdAccountCircle,
    MdAttachMoney,
    MdPublic,
    MdAutorenew,
    MdAddBox,
    MdReceiptLong,
    MdPieChart,
    MdTrendingUp,
    MdColorLens,
    MdDesktopWindows,
    MdViewModule,
    MdMenu,
} from 'react-icons/md'
import type { ReactElement } from 'react'

export type NavigationIcons = Record<string, ReactElement>

const navigationIcon: NavigationIcons = {
    // === ICONOS BÁSICOS ===
    home: <MdHome />,
    users: <MdPeople />,
    product: <MdCategory />,
    document: <MdDescription />,
    briefcase: <MdBusinessCenter />,
    userGroup: <MdGroups />,
    truck: <MdLocalShipping />,
    cog: <MdSettings />,
    calculator: <MdCalculate />,
    invoice: <MdReceipt />,
    receipt: <MdListAlt />,
    percentage: <MdPercent />,
    presupuesto: <MdAssignmentTurnedIn />,

    // === ICONOS PARA CATÁLOGOS ===
    database: <MdStorage />,
    package: <MdCollections />,
    chartBar: <MdBarChart />,

    // === ICONOS PARA OPERACIONES RÁPIDAS ===
    lightning: <MdFlashOn />,
    userAdd: <MdPersonAdd />,
    buildingAdd: <MdLocationCity />,
    documentAdd: <MdAddBox />,
    receiptAdd: <MdReceiptLong />,
    userPlus: <MdAccountCircle />,

    // === ICONOS PARA FACTURACIÓN ===
    receiptTax: <MdReceipt />,

    // === ICONOS PARA FINANZAS ===
    chartLine: <MdPieChart />,
    cash: <MdAttachMoney />,
    trendingUp: <MdTrendingUp />,

    // === ICONOS PARA CONFIGURACIÓN ===
    currency: <MdAttachMoney />,
    exchange: <MdAutorenew />,
    globe: <MdPublic />,

    // === ICONOS DEL TEMPLATE ORIGINAL (mantener por compatibilidad) ===
    fileText: <MdAssignmentTurnedIn />,
    singleMenu: <MdViewModule />,
    collapseMenu: <MdMenu />,
    groupSingleMenu: <MdDesktopWindows />,
    groupCollapseMenu: <MdColorLens />,
}

export default navigationIcon
