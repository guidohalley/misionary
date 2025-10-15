import SignInForm from './SignInForm'

const SignIn = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1 text-xl font-semibold">Iniciar Sesión</h3>
                <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
            </div>
            <SignInForm disableSubmit={false} />
        </>
    )
}

export default SignIn
