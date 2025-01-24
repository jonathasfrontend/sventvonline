import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Header } from "../components/Header";
import { CardChannel } from "../components/CardChannel";
import { Bounce, ToastContainer } from "react-toastify";
import Movies from "@/components/MovieCard";
import Slider from "react-slick"; // Importação do carrossel

interface Movie {
  id: string;
  nowContentId: string;
  title: string;
  rating: {
    description: string;
  };
  runTime: string;
  description: {
    short: string;
  };
  assets: [
    {
      ratio: string;
      url: string;
      category: string;
    }
  ];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [channelsTvAberta, setChannelsTvAberta] = useState<any[]>([]);
  const [channelsFilmes, setChannelsFilmes] = useState<any[]>([]);
  const [channelsInfantil, setChannelsInfantil] = useState<any[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const [ moviesResponse, channelsTvAbertaResponse, channelsFilmesResponse, channelsInfantilResponse ] = await Promise.all([
          await api.get('/metadata/movies'),
          await api.get("/liked/channelswithlikes/Tv Aberta"),
          await api.get("/liked/channelswithlikes/Filmes"),
          await api.get("/liked/channelswithlikes/Infantil"),
         // await api.get('/metadata/series');
        // await api.get('/metadata/channels');

        ])


        const moviesData = moviesResponse.data.destaques || [];

        setChannelsTvAberta(channelsTvAbertaResponse.data);
        setChannelsFilmes(channelsFilmesResponse.data);
        setChannelsInfantil(channelsInfantilResponse.data);
        setMovies(moviesData);
        // setSeries(seriesResponse.data);
        // setChannels(channelsResponse.data);
      } catch (error) {
        console.error('Error fetching highlights:', error);
      }
    };

    fetchHighlights();
  }, []);

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    if (!token) {
      navigate("/");
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Configurações do carrossel
  const carouselSettingsFilmes = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const carouselSettingsChannel = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

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
      <div className="w-full flex flex-col items-center justify-center">
        <h1 className="text-white text-2xl font-bold mt-5">
          Confira o Top 10 filmes mais assistidos na Sventv
        </h1>

        {/* Carrossel dos filmes */}
        <div className="w-full px-16 py-8">
          <Slider {...carouselSettingsFilmes}>
            {movies.map((movie) => (
              <Movies
                key={movie.id}
                id={movie.id}
                title={movie.title}
                rating={movie.rating}
                description={movie.description}
                assets={movie.assets}
              />
            ))}
          </Slider>
        </div>
      </div>

      {/* Lista dos canais */}
      <div className="w-full flex flex-col  items-center justify-center">
        <h1 className="text-white text-xl font-bold ">
          Tv Aberta
        </h1>
      <div className="w-full gap-5 px-16 py-8">
        <Slider {...carouselSettingsChannel}>
          {channelsTvAberta.map((channel) => (
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
        </Slider>
      </div>
      </div>

      <div className="w-full flex flex-col  items-center justify-center">
        <h1 className="text-white text-xl font-bold ">
          Filmes
        </h1>
      <div className="w-full gap-5 px-16 py-8">
        <Slider {...carouselSettingsChannel}>
          {channelsFilmes.map((channel) => (
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
        </Slider>
      </div>
      </div>

      <div className="w-full flex flex-col  items-center justify-center">
        <h1 className="text-white text-xl font-bold ">
          Infantil
        </h1>
      <div className="w-full gap-5 px-16 py-8">
        <Slider {...carouselSettingsChannel}>
          {channelsInfantil.map((channel) => (
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
        </Slider>
      </div>
      </div>

    </div>
  );
}
