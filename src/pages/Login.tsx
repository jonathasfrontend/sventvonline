import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Bounce, ToastContainer } from 'react-toastify';
import { CaretRight, CircleNotch, Eye, EyeSlash } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import logo from '../img/white_logo.png';
import background from '../img/white_logo_solo.png';
import logoVazado from '../img/white_logo_solo_vazado.png'
import { Separator } from "@/components/ui/separator"

type SignInData = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<SignInData>();
  const { signIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSignIn(data: SignInData) {
    setIsLoading(true);
    try {
      await signIn(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="relative min-h-screen flex items-stretch bg-[#3fa5ff10]">

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <div className='flex-1 flex items-center justify-center bg-cover bg-center max-[1100px]:hidden'>
        <img src={background} alt="" className='w-[400px] h-auto object-cover' />
      </div>

      <div className='w-[40%] h-screen gap-3 flex-[560px_1_0] min-[1101px]:max-w-[560px] max-[1100px]:flex-1 bg-background'>
        <div className='h-[100dvh] bg-gray-850 p-20 overflow-auto max-[1100px]:h-auto max-[1100px]:min-h-[calc(100dvh-16px)] max-[1100px]:p-7'>
          <div className='flex flex-col'>
            <div className='w-full flex items-center'>
              <img src={logo} className='w-[120px]' alt="" />
            </div>
            <h2 className="font-bold text-sky-100 text-2xl mt-16 mb-12 max-md:mt-12 max-md:mb-8">
              Acesse sua conta
            </h2>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit(handleSignIn)}>
              <div className='flex flex-col gap-2 [&>label]:text-sm [&>label]:text-gray-200'>
                <label htmlFor="email-address">
                  E-mail
                </label>
                <div className='flex w-full h-11 px-4 py-3 justify-center items-center gap-2 rounded-sm bg-input border transition-opacity'>
                  <input
                    {...register('email')}
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="outline-none border-none w-full h-full text-gray-100 text-base font-normal bg-transparent placeholder:text-gray-400 transition-colors"
                    placeholder="Seu e-mail"
                  />
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <div className='flex flex-col gap-2 [&>label]:text-sm [&>label]:text-gray-200'>
                  <label htmlFor="password">
                    Senha
                  </label>
                  <div className="flex w-full h-11 px-4 py-3 justify-center items-center gap-2 rounded-sm bg-input border transition-opacity">
                    <input
                      {...register('password')}
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      className="outline-none border-none w-full h-full text-gray-100 text-base font-normal bg-transparent placeholder:text-gray-400 transition-colors"
                      placeholder="Sua senha"
                    />
                    <span className='AuiTextField-icon flex flex-shrink-0 justify-center items-center size-6 [&>svg]:size-6 text-gray-500 group-focus-within:text-purpleseat-base'>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeSlash className='w-6 h-6' /> : <Eye className='w-6 h-6' />}
                      </button>
                    </span>
                  </div>
                </div>
                <Link to={'/forgot'} className='text-[#3fa6ff] text-sm font-medium text-purpleseat-light hover:brightness-125 transition'>
                  Esqueceu a senha?
                </Link>
              </div>

              <button
                type="submit"
                className="relative inline-flex bg-[#3fa6ff] hover:bg-[#318ad7] flex-shrink-0 justify-center items-center gap-2 rounded transition-colors ease-in-out duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:select-none border-none cursor-pointer overflow-hidden bg-purpleseat-dark hover:enabled:bg-purpleseat-base text-white px-4 py-3 [&_svg]:size-6 text-md leading-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircleNotch className="animate-spin text-white" size={32} />
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            <Separator className='bg-[#40729e1d] mb-6 mt-16 max-md:mt-12' />

            <Link to={'/signup'} className='text-white text-sm font-semibold hover:decoration-white ml-1'>
              <div className="w-full flex items-center justify-between px-6 py-4 bg-gray-700 border border-gray-600 hover:brightness-125 transition rounded-md">
                <div className='flex items-center'>
                  <img src={logoVazado} alt="" className="w-5 h-auto mr-5 " />
                  <div className="flex flex-col text-gray-200">
                    Não tem uma conta?
                    <span className="text-purpleseat-light font-medium">Se inscreva gratuitamente</span>
                  </div>
                </div>
                <CaretRight className='w-5' />
              </div>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
