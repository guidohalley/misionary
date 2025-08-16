import React, { cloneElement, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Avatar from '@/components/ui/Avatar'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'

interface SideProps extends CommonProps {
    content?: React.ReactNode
}

const Side = ({ children, content, ...rest }: SideProps) => {
    const location = useLocation()
    const isInviteRegistration = location.pathname?.startsWith('/complete-provider-registration')

    // Estado para cambiar entre patrones
    const [currentPattern, setCurrentPattern] = useState(1)
    
    const patterns = [
        '/img/others/fondo1.png', // Original
        '/patrones/msnr1.png',
        '/patrones/msnr2.png', 
        '/patrones/msnr3.png',
        '/patrones/msnr4.png'
    ]

    const patternNames = [
        'Original',
        'MSNR Pattern 1',
        'MSNR Pattern 2', 
        'MSNR Pattern 3',
        'MSNR Pattern 4'
    ]
    return (
        <div className="grid lg:grid-cols-3 h-full relative">
            {/* FONDO ÉPICO EXTENDIDO A TODA LA PANTALLA */}
            <div
                className="absolute inset-0 bg-no-repeat bg-cover transition-all duration-1000 ease-in-out"
                style={{
                    backgroundImage: `url('${patterns[currentPattern]}')`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
            >
                {/* Overlay NEGRO COMPLETO - Toda la pantalla */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(circle at 30% 20%, rgba(233, 252, 135, 0.12) 0%, transparent 70%),
                            radial-gradient(circle at 70% 80%, rgba(233, 252, 135, 0.08) 0%, transparent 60%),
                            radial-gradient(circle at 10% 70%, rgba(233, 252, 135, 0.06) 0%, transparent 55%),
                            rgba(0, 0, 0, 0.75)
                        `
                    }}
                    aria-hidden="true"
                />
            </div>

            {/* Selector de patrones - FLOTANTE EN LA ESQUINA (oculto en mobile) */}
            <div className="absolute top-4 right-4 z-50 hidden md:block">
                <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-3 border border-white/30 shadow-lg">
                    <div className="text-xs text-white/80 mb-2 font-semibold text-center">Background</div>
                    <div className="flex gap-2">
                        {patterns.map((pattern, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPattern(index)}
                                className={`w-8 h-8 rounded-lg border-2 transition-all duration-300 overflow-hidden relative group ${
                                    currentPattern === index 
                                        ? 'border-[#E9FC87] scale-110 shadow-[0_0_12px_rgba(233,252,135,0.5)]' 
                                        : 'border-white/40 hover:border-white/60 hover:scale-105'
                                }`}
                                title={patternNames[index]}
                            >
                                <div 
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                    style={{ backgroundImage: `url('${pattern}')` }}
                                />
                                {currentPattern === index && (
                                    <div className="absolute inset-0 bg-[#E9FC87]/20 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-[#E9FC87] rounded-full animate-pulse"></div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="text-xs text-white/60 mt-2 text-center">
                        {patternNames[currentPattern]}
                    </div>
                </div>
            </div>

            <div className="relative z-10 hidden lg:block h-full">
                {/* Contenido con mejoras enterprise */}
                <div className="relative z-10 py-8 px-16 flex flex-col justify-between h-full">
                    {/* Logo de marca mejorado */}
                    <div className="flex items-center gap-4 group">
                        <div className="relative">
                            <img 
                                src="/msnr.svg" 
                                alt="Misionary" 
                                className="h-12 w-auto drop-shadow-[0_4px_12px_rgba(233,252,135,0.4)] transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_6px_16px_rgba(233,252,135,0.5)]" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-[#E9FC87]/20 to-transparent rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="h-8 w-px bg-gradient-to-b from-transparent via-[#E9FC87]/30 to-transparent"></div>
                        <div className="text-[#F2F2F2] font-bold text-xl tracking-wide">
                            M<span className="text-[#E9FC87]">I</span>SIONARY
                        </div>
                        <span className="sr-only">{APP_NAME}</span>
                    </div>

                    {/* Mensaje épico y avatar mejorados */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-6 group">
                            <div className="flex -space-x-3">
                                <div className="relative">
                                    <Avatar
                                        className="border-3 border-[#E9FC87] shadow-[0_0_0_4px_rgba(233,252,135,0.25)] overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_0_6px_rgba(233,252,135,0.35)]"
                                        shape="circle"
                                        size={72}
                                        src="/img/avatars/santi.png"
                                        imgPosition="top"
                                        alt="Santi"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#10B981] border-2 border-white rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <Avatar
                                        className="border-3 border-[#E9FC87] shadow-[0_0_0_4px_rgba(233,252,135,0.25)] overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_0_6px_rgba(233,252,135,0.35)]"
                                        shape="circle"
                                        size={72}
                                        src="/img/avatars/guido.png"
                                        imgPosition="top"
                                        alt="Guido"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#10B981] border-2 border-white rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-[#F2F2F2] flex-1">
                                <div className="font-bold text-lg tracking-wide mb-1 bg-gradient-to-r from-[#F2F2F2] to-[#E9FC87] bg-clip-text text-transparent">
                                    Santiago Feltan & Guido Halley
                                </div>
                                <div className="flex items-center gap-2 text-[#E9FC87]/80">
                                    <div className="w-2 h-2 bg-[#E9FC87] rounded-full animate-pulse"></div>
                                    <span className="font-medium">Fundadores • Misionary</span>
                                </div>
                            </div>
                        </div>

                        {/* Frase de valores premium */}
                        <div className="relative">
                            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-[#E9FC87] via-[#E9FC87]/60 to-transparent rounded-full"></div>
                            <div className="pl-8 pr-4">
                                <div className="relative bg-gradient-to-br from-white/5 to-white/1 backdrop-blur-sm rounded-2xl p-6 border border-[#E9FC87]/20">
                                    <div className="absolute top-4 left-4 text-[#E9FC87]/40 text-6xl font-bold leading-none">"</div>
                                    <div className="relative z-10 pt-8">
                                        <p className="text-xl leading-relaxed text-[#F2F2F2] mb-4">
                                            <span className="text-[#E9FC87] font-bold">Valor #1</span>: la realización
                                            profesional de cada persona que elige construir con nosotros.
                                        </p>
                                        <p className="text-base text-[#F2F2F2]/90 leading-relaxed">
                                            Crecemos cuando vos crecés. Esa es nuestra misión.
                                        </p>
                                    </div>
                                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#E9FC87]/20 rounded-full blur-sm"></div>
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#E9FC87]/30 rounded-full blur-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer mejorado */}
                    <div className="flex items-center justify-between">
                        <span className="text-[#F2F2F2]/80 text-sm">
                            Copyright &copy; {`${new Date().getFullYear()}`}{' '}
                            <span className="font-bold text-[#E9FC87]">{`${APP_NAME}`}</span>
                        </span>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                            <span className="text-xs text-[#F2F2F2]/60 font-medium">Sistema Activo</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-span-2 flex flex-col justify-center items-center relative overflow-hidden">
                {/* Elementos decorativos flotantes más sutiles */}
                <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-[#E9FC87]/8 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-32 left-16 w-24 h-24 bg-gradient-to-br from-[#E9FC87]/10 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 right-12 w-16 h-16 bg-gradient-to-br from-[#E9FC87]/6 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>

                {/* Contenedor del formulario con glass morphism mejorado */}
        <div className="relative z-10 w-full xl:max-w-[720px] px-6 max-w-[640px]">
                    <div className="relative">
                        {/* Glass card container AJUSTADO PARA OVERLAY NEGRO */}
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-none transition-all duration-300">
                            {/* Decoraciones suavizadas (removidas para un look más limpio) */}

                            {/* Header del formulario: oculto en registro por invitación para evitar redundancia */}
                            {!isInviteRegistration && (
                                <div className="text-center mb-6">
                                    <div className="flex items-center justify-center gap-3 mb-6 group">
                                        <div className="relative">
                                            <img 
                                                src="/msnr.svg" 
                                                alt="Misionary" 
                                                className="h-8 w-auto drop-shadow-[0_4px_10px_rgba(233,252,135,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_6px_14px_rgba(233,252,135,0.45)]" 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#E9FC87]/20 to-transparent rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                        <div className="h-8 w-px bg-gradient-to-b from-transparent via-[#E9FC87]/50 to-transparent"></div>
                                        <span className="text-[#262626] font-bold text-lg tracking-wide">
                                            M<span className="text-[#E9FC87] drop-shadow-sm">S</span>NR
                                        </span>
                                    </div>
                                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#E9FC87]/60 to-transparent mx-auto mb-2"></div>
                                    <p className="text-xs text-gray-600 font-medium">Enterprise Management System</p>
                                </div>
                            )}

                            {/* Contenido del formulario */}
                            <div className={`space-y-5 ${isInviteRegistration ? 'mt-0' : ''}`}>
                                <div>{content}</div>
                                {children
                                    ? cloneElement(children as React.ReactElement, {
                                          ...rest,
                                      })
                                    : null}
                            </div>

                {/* Footer del card con indicadores de seguridad minimal */}
                <div className="mt-5 pt-4 border-t border-white/10">
                <div className="flex items-center justify-center gap-6 text-[11px] text-white/70 mb-2">
                                    <div className="flex items-center gap-2 group">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="transition-colors">Conexión Segura</span>
                                    </div>
                                    <div className="w-px h-4 bg-gradient-to-b from-transparent via-gray-400 to-transparent"></div>
                                    <div className="flex items-center gap-2 group">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="transition-colors">SSL Encriptado</span>
                                    </div>
                                    <div className="w-px h-4 bg-gradient-to-b from-transparent via-gray-400 to-transparent"></div>
                                    <div className="flex items-center gap-2 group">
                    <div className="w-2 h-2 bg-[#E9FC87] rounded-full"></div>
                    <span className="transition-colors font-medium">Enterprise Ready</span>
                                    </div>
                                </div>
                {/* Línea fina */}
                <div className="w-full h-px bg-white/10"></div>
                            </div>
                        </div>
            {/* Sombras externas removidas para mayor simpleza */}
                    </div>
                </div>

                {/* Decoración de partículas flotantes */}
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#E9FC87]/40 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
                <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-[#E9FC87]/30 rounded-full animate-ping" style={{ animationDelay: '6s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-0.5 h-0.5 bg-[#E9FC87]/50 rounded-full animate-ping" style={{ animationDelay: '9s' }}></div>
            </div>
        </div>
    )
}

export default Side
