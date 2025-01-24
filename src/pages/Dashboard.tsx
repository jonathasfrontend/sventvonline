import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Header } from "../components/Header";
import { CardChannel } from "../components/CardChannel";
import { Bounce, ToastContainer } from 'react-toastify'

export default function Dashboard() {
  const navigate = useNavigate();
  const [channels, setChannels] = useState<any[]>([]);

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (!token) {
      navigate("/");
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;

    async function getChannels() {
      try {
        const response = await api.get("/liked/channelswithlikes");
        if (!isMounted) return;
        setChannels(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    getChannels();

    return () => {
      isMounted = false; // Cancela a execução em caso de desmontagem
    };
  }, []);

  useEffect(() => {
    const cachedChannels = localStorage.getItem("cached_channels");
    if (cachedChannels) {
      setChannels(JSON.parse(cachedChannels));
    } else {
      async function getChannels() {
        try {
          const response = await api.get("/liked/channelswithlikes");
          setInterval(() => {
            setChannels(response.data);
            // Atualiza a cada 5 segundos
          } , 5000);
          localStorage.setItem("cached_channels", JSON.stringify(response.data));
        } catch (error) {
          console.error(error);
        }
      }
      getChannels()
    }
  }, []);
  

  return (
    <div className="min-h-screen bg-[#121214]">
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

      <Header />
      <div className="grid grid-cols-4 gap-28 px-16 py-8">
        {channels.map((channel) => (
          <CardChannel
            key={channel.id}
            id={channel.id}
            name={channel.name}
            url={channel.url}
            description={channel.description}
            image={channel.image}
            likeCount={channel.like_count}
            likedBy={channel.liked_by}
          />
        ))}
      </div>
    </div>
  );
}
