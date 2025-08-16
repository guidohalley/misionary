import classNames from 'classnames'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'

interface MsnrLogoProps extends CommonProps {
    type?: 'full' | 'streamline'
    logoWidth?: number | string
    imgClass?: string
}

const MsnrLogo = (props: MsnrLogoProps) => {
    const {
        type = 'full',
        className,
        imgClass,
        style,
        logoWidth = 'auto',
    } = props

    return (
        <div
            className={classNames('logo flex items-center justify-center w-full py-4', className)}
            style={{
                ...style,
                ...{ width: logoWidth },
            }}
        >
            <div className="flex items-center gap-3">
                <img
                    className={classNames(imgClass, 'h-10 w-10')}
                    src="/img/logo/msnr.svg"
                    alt={`${APP_NAME} logo`}
                />
                {type === 'full' && (
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-dark-700" style={{ color: '#262626' }}>
                            MISIONARY
                        </span>
                        <span className="text-xs text-gray-500 font-medium tracking-wide">
                            Gestión Empresarial
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MsnrLogo
