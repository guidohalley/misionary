import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import ActionLink from '@/components/shared/ActionLink'
import { motion } from 'framer-motion'
import { apiForgotPassword } from '@/services/AuthService'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import type { AxiosError } from 'axios'

interface ForgotPasswordFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type ForgotPasswordFormSchema = {
    email: string
}

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Por favor ingresá un email válido')
        .required('El email es requerido'),
})

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    const [emailSent, setEmailSent] = useState(false)

    const [message, setMessage] = useTimeOutMessage()

    const onSendMail = async (
        values: ForgotPasswordFormSchema,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        setSubmitting(true)
        try {
            const resp = await apiForgotPassword(values)
            if (resp.data) {
                setSubmitting(false)
                setEmailSent(true)
            }
        } catch (errors) {
            setMessage(
                (errors as AxiosError<{ message: string }>)?.response?.data
                    ?.message || (errors as Error).toString(),
            )
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
            {/* Enterprise Background with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-msgray-900"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E9FC87]/5 via-transparent to-[#E9FC87]/10"></div>
            
            {/* Animated Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#E9FC87]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                {/* MISIONARY Branding */}
                <motion.div 
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#E9FC87] to-[#E9FC87]/80 mb-4 shadow-lg shadow-[#E9FC87]/25">
                        <span className="text-2xl font-bold text-msgray-900">M</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">MISIONARY</h1>
                    <p className="text-slate-400">Gestión empresarial inteligente</p>
                </motion.div>

                {/* Glass Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8"
                >
                    <div className="text-center mb-8">
                        {emailSent ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 mb-4">
                                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">¡Email enviado! 📧</h3>
                                <p className="text-slate-300">
                                    Te mandamos las instrucciones para recuperar tu contraseña. 
                                    <br />
                                    <span className="text-[#E9FC87] font-medium">¡Revisá tu bandeja de entrada!</span>
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 mb-4">
                                    <span className="text-2xl">🤦‍♂️</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">¿Te olvidaste la contraseña otra vez?</h3>
                                <p className="text-slate-300">
                                    Tranqui, pasa. Ingresá tu email y te mandamos las instrucciones
                                    <br />
                                    <span className="text-[#E9FC87] font-medium">para que puedas entrar de vuelta</span>
                                </p>
                            </motion.div>
                        )}
                    </div>
                    
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6"
                        >
                            <Alert showIcon className="backdrop-blur-sm bg-red-500/20 border-red-500/30 text-red-100" type="danger">
                                {message}
                            </Alert>
                        </motion.div>
                    )}

                    <Formik
                        initialValues={{
                            email: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            if (!disableSubmit) {
                                onSendMail(values, setSubmitting)
                            } else {
                                setSubmitting(false)
                            }
                        }}
                    >
                        {({ touched, errors, isSubmitting }) => (
                            <Form className="space-y-6">
                                <FormContainer>
                                    <div className={emailSent ? 'hidden' : 'space-y-6'}>
                                        <FormItem
                                            label="Email"
                                            invalid={errors.email && touched.email}
                                            errorMessage={errors.email}
                                            className="space-y-2"
                                        >
                                            <Field
                                                type="email"
                                                autoComplete="email"
                                                name="email"
                                                placeholder="tu@email.com"
                                                component={Input}
                                                className="backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-[#E9FC87] focus:ring-[#E9FC87]/20"
                                            />
                                        </FormItem>

                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                block
                                                loading={isSubmitting}
                                                variant="solid"
                                                type="submit"
                                                className="bg-gradient-to-r from-[#E9FC87] to-[#E9FC87]/90 hover:from-[#E9FC87]/90 hover:to-[#E9FC87]/80 text-msgray-900 font-semibold py-3 shadow-lg shadow-[#E9FC87]/25 transition-all duration-300"
                                            >
                                                {isSubmitting ? (
                                                    <span className="flex items-center justify-center">
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-msgray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Enviando email...
                                                    </span>
                                                ) : (
                                                    'Mandar instrucciones'
                                                )}
                                            </Button>
                                        </motion.div>
                                    </div>

                                    {emailSent && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <Button
                                                block
                                                loading={isSubmitting}
                                                variant="solid"
                                                type="submit"
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 shadow-lg shadow-blue-500/25 transition-all duration-300"
                                            >
                                                {isSubmitting ? 'Reenviando...' : 'Reenviar email'}
                                            </Button>
                                        </motion.div>
                                    )}

                                    {/* Back to Sign In */}
                                    <div className="mt-8 text-center">
                                        <p className="text-slate-400 text-sm">
                                            ¿Ya te acordaste? {' '}
                                            <ActionLink 
                                                to={signInUrl}
                                                className="text-[#E9FC87] hover:text-[#E9FC87]/80 transition-colors duration-200 font-medium"
                                            >
                                                Volver al login
                                            </ActionLink>
                                        </p>
                                    </div>
                                </FormContainer>
                            </Form>
                        )}
                    </Formik>
                </motion.div>

                {/* Footer */}
                <motion.div 
                    className="text-center mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    <p className="text-slate-500 text-sm">
                        © 2025 MISIONARY. Hecho con ❤️ para empresas argentinas.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}
                        </p>
                    </>
                )}
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    email: 'admin@mail.com',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSendMail(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className={emailSent ? 'hidden' : ''}>
                                <FormItem
                                    invalid={errors.email && touched.email}
                                    errorMessage={errors.email}
                                >
                                    <Field
                                        type="email"
                                        autoComplete="off"
                                        name="email"
                                        placeholder="Email"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {emailSent ? 'Resend Email' : 'Send Email'}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>Back to </span>
                                <ActionLink to={signInUrl}>Sign in</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ForgotPasswordForm
