import { useEffect, useState } from 'react';
import { parseCookies } from "nookies";
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Header } from '../components/Header';
import { CardChannelGuia } from '../components/CardChannelguia';

interface GuiaChannel {
  id_canal: string;
  nome: string;
  url_imagem: string;
  programacao_atual: {
    titulo: string;
    inicio: string;
    fim: string;
  };
  programacao_proximas: {
    titulo: string;
    inicio: string;
    fim: string;
  };
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

  return (
    <div className="min-h-screen bg-[#121214]">
      <Header />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-clos-5 gap-4 p-8">
        {guia.map((channel) => (
          <CardChannelGuia
            key={channel.id_canal}
            id_canal={channel.id_canal}
            nome={channel.nome}
            url_imagem={channel.url_imagem}
            programacao_atual={channel.programacao_atual}
            programacao_proximas={channel.programacao_proximas}
          />
        ))}
      </div>
    </div>
  );
}
