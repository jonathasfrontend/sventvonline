import { useEffect, useState } from 'react';
import { destroyCookie, parseCookies } from "nookies";
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface GuiaChannel {
  id_canal: string,
  nome: string,
  url_imagem: string,
  programacao_atual: {
      titulo: string,
      inicio: string,
      fim: string
  },
  programacao_proximas: {
      titulo: string,
      inicio: string,
      fim: string
  }
}

export default function Guia() {
  const navigate = useNavigate();
  const [guia, setGuia] = useState<GuiaChannel[]>([]);

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (!token) {
      navigate('/');
    } else {
      navigate('/programacao');
    }
  }, [navigate]);

  useEffect(() => {
    async function getOrders() {
      try {
        const response = await api.get('/guiatv/canais-programacao');
        setGuia(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    getOrders();
  }, []);

  const handleSignOut = () => {
    destroyCookie(null, "nextauth.token");
    navigate('/');
  };

  return (
    <div className='min-h-screen bg main_dashboard'>

      <div className="relative w-full overflow-auto grid-cols-4 grid gap-2 px-16 py-5 bg-[#121214]">
        {
          guia.map((channel) => (
            <div key={channel.id_canal} className="w-full h-full relative flex flex-col items-center justify-center rounded-md text-white bg-[#323262] px-5 py-2 overflow-hidden">
              <img src={channel.url_imagem} alt={channel.nome} className='w-[100px]'/>
              <button onClick={handleSignOut} className='absolute top-2 right-2 text-white bg-red-500 px-2 py-1 rounded-md'>Sair</button>
              {/* <h2>{channel.nome}</h2> */}
              <div>
                <p className='text-base'>{channel.programacao_atual.titulo}</p>
                {/* <p>{channel.programacao_atual.inicio} - {channel.programacao_atual.fim}</p> */}
                <p className='text-base'>{channel.programacao_proximas.titulo}</p>
                {/* <p>{channel.programacao_proximas.inicio} - {channel.programacao_proximas.fim}</p> */}
              </div>
            </div>
          ))
        }

      </div>

    </div>
  );
}
