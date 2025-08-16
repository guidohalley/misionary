import Header from '@/components/template/Header'
import UserDropdown from '@/components/template/UserDropdown'
import ThemeModeSwitcher from '@/components/template/ThemeModeSwitcher'
import SideNavToggle from '@/components/template/SideNavToggle'
import MobileNav from '@/components/template/MobileNav'
import SideNav from '@/components/template/SideNav'
import HeaderPageTitle from '@/components/template/HeaderPageTitle'
import View from '@/views'
import { motion } from 'framer-motion'

const HeaderActionsStart = () => {
    return (
        <div className="flex items-center gap-4">
            <MobileNav />
            <SideNavToggle />
        </div>
    )
}

const HeaderActionsMiddle = () => {
    return <HeaderPageTitle />
}

const HeaderActionsEnd = () => {
    return (
        <div className="flex items-center gap-2">
            <ThemeModeSwitcher hoverable={false} />
            <UserDropdown hoverable={false} />
        </div>
    )
}

const ModernLayout = () => {
    return (
        <div className="app-layout-modern flex flex-auto flex-col">
            <div className="flex flex-auto min-w-0">
                <motion.div
                    initial={{ x: -250, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <SideNav />
                </motion.div>
                <motion.div 
                    className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <Header
                            className="border-b border-gray-200 dark:border-gray-700"
                            headerStart={<HeaderActionsStart />}
                            headerMiddle={<HeaderActionsMiddle />}
                            headerEnd={<HeaderActionsEnd />}
                        />
                    </motion.div>
                    <motion.div
                        className="flex-1"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <View />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default ModernLayout
