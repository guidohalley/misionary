import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useAuth from '@/utils/hooks/useAuth'
import { useAppSelector } from '@/store'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineLogout, HiOutlineUser } from 'react-icons/hi'
import type { CommonProps } from '@/@types/common'
import type { JSX } from 'react'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

const dropdownItemList: DropdownList[] = []

const _UserDropdown = ({ className }: CommonProps) => {
    const { signOut } = useAuth()
    
    // Obtener datos del usuario desde Redux
    const user = useAppSelector((state) => state.auth.user)
    const session = useAppSelector((state) => state.auth.session)
    const userName = user?.userName || 'Usuario'
    const userEmail = user?.email || 'usuario@ejemplo.com'
    const userAuthority = user?.authority?.[0] || 'USER'
    
    // Debug - log para verificar datos
    // console.log('UserDropdown - Usuario actual:', user)
    // console.log('UserDropdown - Sesión actual:', session)

    const handleSignOut = () => {
        console.log('UserDropdown - Cerrando sesión...')
        signOut()
    }

    // Iniciales a partir del nombre o email
    const initials = (userName || userEmail)
        .split(/\s|@/)
        .filter(Boolean)
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase())
        .join('') || 'US'

    const UserAvatar = (
        <div className={classNames(className, 'flex items-center gap-2 cursor-pointer')}>
            <Avatar
                size={32}
                shape="circle"
                className="bg-msgray-600 text-white font-semibold"
            >
                {initials}
            </Avatar>
            <div className="hidden md:block leading-tight">
                <div className="text-[11px] uppercase tracking-wide text-gray-600 dark:text-gray-400">{userAuthority.toLowerCase()}</div>
                <div className="font-bold text-gray-900 dark:text-gray-100 mt-0.5">{userName}</div>
            </div>
        </div>
    )

    return (
        <div>
            <Dropdown
                menuStyle={{ minWidth: 240 }}
                renderTitle={UserAvatar}
                placement="bottom-end"
            >
                <Dropdown.Item variant="header">
                    <div className="py-2 px-3 flex items-center gap-2">
                        <Avatar shape="circle" className="bg-msgray-600 text-white font-semibold">
                            {initials}
                        </Avatar>
                        <div className="leading-tight">
                            <div className="text-[11px] uppercase tracking-wide text-gray-600 dark:text-gray-400">{userAuthority.toLowerCase()}</div>
                            <div className="font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                                {userName}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{userEmail}
                            </div>
                        </div>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item variant="divider" />
                {dropdownItemList.map((item) => (
                    <Dropdown.Item
                        key={item.label}
                        eventKey={item.label}
                        className="mb-1 px-0"
                    >
                        <Link
                            className="flex h-full w-full px-2"
                            to={item.path}
                        >
                            <span className="flex gap-2 items-center w-full">
                                <span className="text-xl opacity-50">
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </span>
                        </Link>
                    </Dropdown.Item>
                ))}
                {/* <Dropdown.Item variant="divider" /> */}
                <Dropdown.Item
                    eventKey="Sign Out"
                    className="gap-2"
                    onClick={handleSignOut}
                >
                    <span className="text-xl opacity-50">
                        <HiOutlineLogout />
                    </span>
                    <span>Cerrar Sesión</span>
                </Dropdown.Item>
            </Dropdown>
        </div>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
