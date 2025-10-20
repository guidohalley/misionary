import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import ActionLink from '@/components/shared/ActionLink'
// import { apiForgotPassword } from '@/services/AuthService'
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
        .email('Ingresa un email válido')
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
            // Endpoint no implementado aún; simulamos éxito inmediato
            await new Promise((resolve) => setTimeout(resolve, 500))
            setSubmitting(false)
            setEmailSent(true)
        } catch (errors) {
            setMessage(
                (errors as AxiosError<{ message: string }>)?.response?.data
                    ?.message || (errors as Error).toString(),
            )
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <div className="mb-6">
                {emailSent ? (
                    <>
                        <h3 className="mb-1 text-xl font-semibold text-[#E9FC87]">Revisa tu correo</h3>
                        <p className="text-white/80">
                            Hemos enviado las instrucciones de recuperación a tu correo electrónico
                        </p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-1 text-xl font-semibold text-[#E9FC87]">Recuperar Contraseña</h3>
                        <p className="text-white/80">
                            Ingresa tu correo electrónico para recibir las instrucciones
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
                                        placeholder="Ingresa tu email"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                className="bg-black hover:bg-black/80 text-[#E9FC87] font-semibold py-3 shadow-lg shadow-black/25 border border-[#E9FC87]/20 transition-all duration-300"
                                type="submit"
                            >
                                {emailSent ? 'Reenviar Email' : 'Enviar Email'}
                            </Button>
                            <div className="mt-4 text-center text-white/80">
                                <span>Volver a </span>
                                <ActionLink 
                                    to={signInUrl}
                                    className="text-[#E9FC87] hover:text-[#E9FC87]/80 transition-colors duration-200 font-medium"
                                >
                                    Iniciar Sesión
                                </ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ForgotPasswordForm
