import Logo from '@/components/template/Logo'
import MsnrLogo from '@/components/template/MsnrLogo'
import { useAppSelector } from '@/store'

const HeaderLogo = () => {
    const mode = useAppSelector((state) => state.theme.mode)

    return <MsnrLogo type="streamline" />

}

export default HeaderLogo
