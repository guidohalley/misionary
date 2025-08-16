import { useCallback } from 'react'
import useDarkMode from '@/utils/hooks/useDarkmode'
import Switcher from '@/components/ui/Switcher'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi'
import type { CommonProps } from '@/@types/common'

const _ThemeModeSwitcher = ({ className }: CommonProps) => {
    const [isDark, setIsDark] = useDarkMode()

    const onSwitchChange = useCallback(
        (checked: boolean) => {
            setIsDark(checked ? 'dark' : 'light')
        },
        [setIsDark],
    )

    return (
        <div className={className}>
            <Switcher
                defaultChecked={isDark}
                onChange={onSwitchChange}
                checkedContent={
                    <HiOutlineMoon className="text-xs" />
                }
                unCheckedContent={
                    <HiOutlineSun className="text-xs" />
                }
                color="msgray"
                className="transition-colors duration-200"
            />
        </div>
    )
}

const ThemeModeSwitcher = withHeaderItem(_ThemeModeSwitcher)

export default ThemeModeSwitcher
