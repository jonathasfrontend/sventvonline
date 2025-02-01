import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Bounce, ToastContainer } from 'react-toastify';
import { CircleNotch, Eye, EyeSlash } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import logo from '../img/white_logo.png';
import background from '../img/white_logo_solo.png';

type SignUpData = {
  username: string;
  email: string;
  avatar: string;
  password: string;
};

export default function Signup() {
  const { register, handleSubmit } = useForm<SignUpData>();
  const { signUp } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSignIn(data: SignUpData) {
    setIsLoading(true);
    try {
      await signUp(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-stretch bg-[#121214]">

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
        theme="dark"
        transition={Bounce}
      />

      <div className='flex-1 flex items-center justify-center bg-cover bg-center max-[1100px]:hidden'>
        <img src={background} alt="" className='w-[400px] h-auto object-cover' />
      </div>

      <div className='w-[40%] h-screen gap-3 flex-[560px_1_0] min-[1101px]:max-w-[560px] max-[1100px]:flex-1 bg-[#3fa5ff10]'>
        <div className='h-[100dvh] bg-gray-850 p-20 overflow-auto max-[1100px]:h-auto max-[1100px]:min-h-[calc(100dvh-16px)] max-[1100px]:p-7'>
          <div className='flex flex-col'>
            <div className='w-full flex items-center'>
              <img src={logo} className='w-[120px]' alt="" />
            </div>
            <h2 className="font-bold text-sky-100 text-2xl mt-16 mb-12 max-md:mt-12 max-md:mb-8">
              Cadastre-se gratuitamente
            </h2>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit(handleSignIn)}>

              <div className='flex flex-col gap-2 [&>label]:text-sm [&>label]:text-gray-200'>
                <label htmlFor="username">
                  Nome Completo
                </label>
                <div className='flex w-full h-11 px-4 py-3 justify-center items-center gap-2 rounded-sm bg-[#3fa5ff2f] box-border transition-opacity focus-within:border-purpleseat-base'>
                  <input
                    {...register('username')}
                    id="username"
                    name="username"
                    required
                    className="outline-none border-none w-full h-full text-gray-100 text-base font-normal bg-transparent placeholder:text-gray-400 transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>

              <div className='flex flex-col gap-2 [&>label]:text-sm [&>label]:text-gray-200'>
                <label htmlFor="email-address">
                  E-mail
                </label>
                <div className='flex w-full h-11 px-4 py-3 justify-center items-center gap-2 rounded-sm bg-[#3fa5ff2f] box-border transition-opacity focus-within:border-purpleseat-base'>
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

              <div className='flex flex-col gap-2 [&>label]:text-sm [&>label]:text-gray-200'>
                <label htmlFor="avatar">
                  Imagem de perfil
                </label>
                <div className='flex w-full h-11 px-4 py-3 justify-center items-center gap-2 rounded-sm bg-[#3fa5ff2f] box-border transition-opacity focus-within:border-purpleseat-base'>
                  <input
                    {...register('avatar')}
                    id="avatar"
                    name="avatar"
                    type="text"
                    autoComplete="email"
                    className="outline-none border-none w-full h-full text-gray-100 text-base font-normal bg-transparent placeholder:text-gray-400 transition-colors"
                    placeholder="URL da sua imagem de perfil"
                  />
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <div className='flex flex-col gap-2 [&>label]:text-sm [&>label]:text-gray-200'>
                  <label htmlFor="password">
                    Senha
                  </label>
                  <div className="flex w-full h-11 px-4 py-3 justify-center items-center gap-2 rounded-sm bg-[#3fa5ff2f] box-border transition-opacity focus-within:border-purpleseat-base">
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
              </div>

              <button
                type="submit"
                className="relative inline-flex bg-[#3fa6ff] hover:bg-[#318ad7] flex-shrink-0 justify-center items-center gap-2 rounded transition-colors ease-in-out duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:select-none border-none cursor-pointer overflow-hidden bg-purpleseat-dark hover:enabled:bg-purpleseat-base text-white px-4 py-3 [&_svg]:size-6 text-md leading-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircleNotch className="animate-spin text-white" size={32} />
                ) : (
                  'Cadastre-se gratuitamente'
                )}
              </button>
            </form>

            <div className='w-full flex items-center justify-between mt-6'>
              <Link to={'/login'} className='text-white text-sm font-semibold hover:decoration-white ml-1'>
                Já tem uma conta? Faça login
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
