import { forwardRef } from 'react'
import classNames from 'classnames'
import type { CommonProps } from '../@types/common'
import type { CSSProperties } from 'react'

export interface BadgeProps extends CommonProps {
    /** Estilos inline para el badge interior (contador o standalone) */
    badgeStyle?: CSSProperties
    /** Contenido del contador (cuando se usa como superposición) o del badge standalone si no hay children */
    content?: string | number
    /** Clases para el badge interior (contador) */
    innerClass?: string
    /** Máximo a visualizar antes de mostrar 99+ (o configurable) */
    maxCount?: number
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>((props, ref) => {
    const {
        badgeStyle,
        children,
        className,
        content,
        innerClass,
        maxCount = 99,
        ...rest
    } = props

    // Normalizar contenido numérico con máximo
    const displayContent =
        typeof content === 'number' && content > maxCount
            ? `${maxCount}+`
            : content

    // Clases base para el pill (standalone o contenido textual)
    const pillBase = 'inline-flex items-center rounded-full text-xs font-medium px-2.5 py-0.5'
    const pillColors = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'

    // Clases base para el contador superpuesto
    const counterBase = 'absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full text-[10px] font-bold min-w-[18px] h-[18px] px-1'
    const counterColors = 'bg-red-500 text-white ring-2 ring-white dark:ring-gray-900'

    // Modo 1: si NO hay children -> render como pill usando content o children
    if (!children) {
        return (
            <span
                ref={ref}
                className={classNames(pillBase, pillColors, className)}
                style={badgeStyle}
                {...rest}
            >
                {displayContent}
            </span>
        )
    }

    // Modo 2: hay children y hay content -> wrapper relativo y contador superpuesto
    if (children && (content !== undefined && content !== null && content !== '')) {
        return (
            <span ref={ref} className={classNames('relative inline-block align-middle', className)} {...rest}>
                {children}
                <span
                    className={classNames(counterBase, counterColors, innerClass)}
                    style={badgeStyle}
                >
                    {displayContent}
                </span>
            </span>
        )
    }

    // Modo 3: hay children pero sin content -> úsalo como pill simple con children dentro
    return (
        <span
            ref={ref}
            className={classNames(pillBase, pillColors, className)}
            style={badgeStyle}
            {...rest}
        >
            {children}
        </span>
    )
})

Badge.displayName = 'Badge'

export default Badge
