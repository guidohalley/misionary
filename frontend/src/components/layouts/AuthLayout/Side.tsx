import { cloneElement } from 'react'
import Avatar from '@/components/ui/Avatar'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'

interface SideProps extends CommonProps {
    content?: React.ReactNode
}

const Side = ({ children, content, ...rest }: SideProps) => {
    return (
        <div className="grid lg:grid-cols-3 h-full">
            <div
                className="relative bg-no-repeat bg-cover hidden lg:block h-full"
                style={{
                    backgroundImage: `url('/img/others/fondo1.png')`,
                }}
            >
                {/* Overlay con gradiente de marca (Gris Oscuro) */}
                <div
                    className="absolute inset-0 bg-gradient-to-b from-[#262626]/85 via-[#262626]/70 to-[#262626]/60"
                    aria-hidden="true"
                />

                {/* Contenido */}
                <div className="relative z-10 py-6 px-16 flex flex-col justify-between h-full">
                    {/* Logo de marca */}
                    <div className="flex items-center gap-3">
                        <img src="/msnr.svg" alt="Misionary" className="h-10 w-auto drop-shadow-[0_2px_6px_rgba(233,252,135,0.35)]" />
                        <span className="sr-only">{APP_NAME}</span>
                    </div>

                    {/* Mensaje épico y avatar */}
                    <div>
                        <div className="mb-6 flex items-center gap-4">
                            <Avatar
                                className="border-2 border-[#E9FC87] shadow-[0_0_0_3px_rgba(233,252,135,0.25)] overflow-hidden"
                                shape="circle"
                                size={64}
                                src="/img/avatars/santi.png"
                                imgPosition="top"
                                alt="Santi"
                                
                            />
                            <Avatar
                                className="border-2 border-[#E9FC87] shadow-[0_0_0_3px_rgba(233,252,135,0.25)] overflow-hidden"
                                shape="circle"
                                size={64}
                                src="/img/avatars/guido.png"
                                imgPosition="top"
                                alt="Guido"
                            />
  
                            <div className="text-[#F2F2F2]">
                                <div className="font-semibold text-base tracking-wide">
                                    Santiago Feltan & Guido Halley
                                </div>
                                <span className="opacity-80">Misionary</span>
                            </div>
                        </div>

                        {/* Frase de valores (Verde Neón + Gris) */}
                        <div className="relative pl-4 border-l-4 border-[#E9FC87]">
                            <p className="text-xl leading-8 text-[#F2F2F2]">
                                <span className="text-[#E9FC87] font-semibold">Valor #1</span>: la realización
                                profesional de cada persona que elige construir con nosotros.
                            </p>
                            <p className="mt-3 text-[#F2F2F2]/80 max-w-[42ch]">
                                Crecemos cuando vos creces. Esa es nuestra misión.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <span className="text-[#F2F2F2]">
                        Copyright &copy; {`${new Date().getFullYear()}`}{' '}
                        <span className="font-semibold">{`${APP_NAME}`}</span>{' '}
                    </span>
                </div>
            </div>
            <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
                <div className="w-full xl:max-w-[450px] px-8 max-w-[380px]">
                    <div className="mb-8">{content}</div>
                    {children
                        ? cloneElement(children as React.ReactElement, {
                              ...rest,
                          })
                        : null}
                </div>
            </div>
        </div>
    )
}

export default Side
