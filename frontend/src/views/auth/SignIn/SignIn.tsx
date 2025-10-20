import SignInForm from './SignInForm'

const SignIn = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1 text-xl font-semibold text-[#E9FC87]">Iniciar Sesión</h3>
                <p className="text-white/80">Ingresa tus credenciales para continuar</p>
            </div>
            <SignInForm disableSubmit={false} />
        </>
    )
}

export default SignIn
