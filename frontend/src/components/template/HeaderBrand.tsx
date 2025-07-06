import MsnrLogo from '@/components/template/MsnrLogo'
import classNames from 'classnames'

const HeaderBrand = () => {
    return (
        <div className={classNames(
            'header-brand',
            'hidden md:block' // Solo visible en desktop
        )}>
            <MsnrLogo type="streamline" />
        </div>
    )
}

export default HeaderBrand
