import classNames from 'classnames'
import Container from '@/components/shared/Container'
import { APP_NAME } from '@/constants/app.constant'
import { PAGE_CONTAINER_GUTTER_X } from '@/constants/theme.constant'

export type FooterPageContainerType = 'gutterless' | 'contained'

type FooterProps = {
    pageContainerType: FooterPageContainerType
}

const FooterContent = () => {
    return (
        <div className="flex items-center justify-between flex-auto w-full max-w-[95%] md:max-w-[90%] xl:max-w-[85%] 2xl:max-w-[80%] mx-auto">
            {/* Logo y nombre */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <img 
                        src="/msnr.svg" 
                        alt="MISIONARY" 
                        className="h-6 w-6 opacity-90 transition-opacity hover:opacity-100"
                    />
                    <span className="text-sm font-bold tracking-wider text-msgray-700 dark:text-msgray-200">
                        MISIONARY
                    </span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-msgray-300 dark:bg-msgray-600"></div>
                <span className="hidden sm:inline-block text-xs text-msgray-500 dark:text-msgray-400 font-medium tracking-wide">
                    Hacemos realidad tu visión digital.
                </span>
            </div>

            {/* Centro - Año y mensaje */}
            <div className="flex items-center gap-3">
                <span className="text-xs text-msgray-500 dark:text-msgray-400 font-medium">
                    © {new Date().getFullYear()}
                </span>
                <div className="w-px h-3 bg-msgray-300 dark:bg-msgray-600"></div>
                <span className="text-xs text-msgray-400 dark:text-msgray-500 italic">
                    Built for <span className="text-brand-primary font-medium drop-shadow-sm">@guidohalley</span>
                </span>
            </div>

            {/* Derecha - Status y versión */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_4px_rgba(233,252,135,0.8)] animate-pulse"></div>
                    <span className="text-xs text-msgray-500 dark:text-msgray-400 font-medium">
                        Online
                    </span>
                </div>
                <div className="hidden md:block w-px h-3 bg-msgray-300 dark:bg-msgray-600"></div>
                <span className="hidden md:inline-block text-xs text-msgray-400 dark:text-msgray-500 font-mono tracking-wider">
                    v2.1.0
                </span>
            </div>
        </div>
    )
}

export default function Footer({
    pageContainerType = 'contained',
}: FooterProps) {
    return (
        <footer
            className={classNames(
                `footer flex flex-auto items-center h-16 border-t border-msgray-200 dark:border-msgray-700 ${PAGE_CONTAINER_GUTTER_X}`,
                'bg-gradient-to-r from-msgray-50/80 via-white to-msgray-50/80',
                'dark:from-msgray-900/80 dark:via-msgray-900 dark:to-msgray-900/80',
                'backdrop-blur-sm'
            )}
        >
            {pageContainerType === 'contained' ? (
                <Container>
                    <FooterContent />
                </Container>
            ) : (
                <FooterContent />
            )}
        </footer>
    )
}
