import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useAuth from '@/utils/hooks/useAuth'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    forgotPasswordUrl?: string
    signUpUrl?: string
}

type SignInFormSchema = {
    email: string
    password: string
    rememberMe: boolean
}

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Ingresa un email válido')
        .required('El email es requerido'),
    password: Yup.string().required('La contraseña es requerida'),
    rememberMe: Yup.bool(),
})

const SignInForm = (props: SignInFormProps) => {
    const {
        disableSubmit = false,
        className,
        forgotPasswordUrl = '/forgot-password',
        signUpUrl = '/sign-up',
    } = props

    const [message, setMessage] = useTimeOutMessage()

    const { signIn } = useAuth()

    const onSignIn = async (
        values: SignInFormSchema,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        const { email, password } = values
        setSubmitting(true)

        const result = await signIn({ email, password })

        if (result?.status === 'failed') {
            setMessage(result.message)
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <>{message}</>
                </Alert>
            )}
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    rememberMe: true,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSignIn(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Email"
                                invalid={(errors.email && touched.email) as boolean}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="email"
                                    name="email"
                                    placeholder="usuario@ejemplo.com"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Contraseña"
                                invalid={
                                    (errors.password &&
                                        touched.password) as boolean
                                }
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="password"
                                    placeholder="Tu contraseña"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <div className="flex justify-between mb-6">
                                <Field
                                    className="mb-0 text-white/80"
                                    name="rememberMe"
                                    component={Checkbox}
                                >
                                    Recordarme
                                </Field>
                                <ActionLink 
                                    to={forgotPasswordUrl}
                                    className="text-[#E9FC87] hover:text-[#E9FC87]/80 transition-colors duration-200 font-medium"
                                >
                                    ¿Olvidaste tu contraseña?
                                </ActionLink>
                            </div>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                className="bg-black hover:bg-black/80 text-[#E9FC87] font-semibold py-3 shadow-lg shadow-black/25 border border-[#E9FC87]/20 transition-all duration-300"
                                type="submit"
                            >
                                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignInForm
