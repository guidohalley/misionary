import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
// import { apiResetPassword } from '@/services/AuthService'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useNavigate } from 'react-router-dom'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import type { AxiosError } from 'axios'

interface ResetPasswordFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type ResetPasswordFormSchema = {
    password: string
    confirmPassword: string
}

const validationSchema = Yup.object().shape({
    password: Yup.string().required('Por favor ingresa tu contraseña'),
    confirmPassword: Yup.string().oneOf(
        [Yup.ref('password')],
        'Las contraseñas no coinciden'
    ),
})

const ResetPasswordForm = (props: ResetPasswordFormProps) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    const [resetComplete, setResetComplete] = useState(false)

    const [message, setMessage] = useTimeOutMessage()

    const navigate = useNavigate()

    const onSubmit = async (
        values: ResetPasswordFormSchema,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        const { password } = values
        setSubmitting(true)
        try {
            // Endpoint no implementado aún; simulamos éxito
            await new Promise((resolve) => setTimeout(resolve, 500))
            setSubmitting(false)
            setResetComplete(true)
        } catch (errors) {
            setMessage(
                (errors as AxiosError<{ message: string }>)?.response?.data
                    ?.message || (errors as Error).toString(),
            )
            setSubmitting(false)
        }
    }

    const onContinue = () => {
        navigate('/sign-in')
    }

    return (
        <div className={className}>
            <div className="mb-6">
                {resetComplete ? (
                    <>
                        <h3 className="mb-1 text-xl font-semibold text-[#E9FC87]">¡Listo!</h3>
                        <p className="text-white/80">Tu contraseña ha sido restablecida con éxito</p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-1 text-xl font-semibold text-[#E9FC87]">Nueva contraseña</h3>
                        <p className="text-white/80">
                            Ingresa y confirma tu nueva contraseña
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
                    password: '123Qwe1',
                    confirmPassword: '123Qwe1',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSubmit(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            {!resetComplete ? (
                                <>
                                    <FormItem
                                        label="Contraseña"
                                        invalid={
                                            errors.password && touched.password
                                        }
                                        errorMessage={errors.password}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="password"
                                            placeholder="Ingresa tu contraseña"
                                            component={PasswordInput}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Confirmar contraseña"
                                        invalid={
                                            errors.confirmPassword &&
                                            touched.confirmPassword
                                        }
                                        errorMessage={errors.confirmPassword}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="confirmPassword"
                                            placeholder="Confirma tu contraseña"
                                            component={PasswordInput}
                                        />
                                    </FormItem>
                                    <Button
                                        block
                                        loading={isSubmitting}
                                        variant="solid"
                                        type="submit"
                                        className="bg-[#E9FC87] text-gray-800 hover:bg-[#E9FC87]/90"
                                    >
                                        {isSubmitting
                                            ? 'Enviando...'
                                            : 'Restablecer contraseña'}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    block
                                    variant="solid"
                                    type="button"
                                    onClick={onContinue}
                                    className="bg-[#E9FC87] text-gray-800 hover:bg-[#E9FC87]/90"
                                >
                                    Continuar
                                </Button>
                            )}

                            <div className="mt-4 text-center text-white/80">
                                <span>Volver al </span>
                                <ActionLink to={signInUrl} className="text-[#E9FC87] hover:text-[#E9FC87]/90">
                                    inicio de sesión
                                </ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ResetPasswordForm
