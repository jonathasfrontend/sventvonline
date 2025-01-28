import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Header } from "../components/Header";
import { CardChannel } from "../components/CardChannel";
import { Bounce, ToastContainer } from "react-toastify";
import Movies from "@/components/MovieCard";
import Slider from "react-slick";
import SampleNextPrevArrow from "@/components/SampleNextPrevArrow";
import Series from "@/components/SerieCard";
import TvCard from "@/components/TvCard";

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

interface Serie {
  id: string,
  nowContentId: string,
  title: string,
  rating: {
    description: string,
  },
  runTime: string,
  description: {
    short: string,
  },
  assets: [
    {
      ratio: string,
      url: string,
      category: string,
    }
  ]
}
interface Tv {
  id: string;
  name: string;
  description: string;
  genre: string;
  channelName: string;
  assets: [
    {
      url: string;
      assetId: string;
    }
  ];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [channelsTvAberta, setChannelsTvAberta] = useState<any[]>([]);
  const [channelsFilmes, setChannelsFilmes] = useState<any[]>([]);
  const [channelsInfantil, setChannelsInfantil] = useState<any[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
  const [tvs, setTv] = useState<Tv[]>([]);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const [
          moviesResponse,
          channelsTvAbertaResponse,
          channelsFilmesResponse,
          channelsInfantilResponse,
          seriesResponse,
          channelsResponse,
        ] = await Promise.all([
          await api.get('/metadata/movies'),
          await api.get("/liked/channelswithlikes/Tv Aberta"),
          await api.get("/liked/channelswithlikes/Filmes"),
          await api.get("/liked/channelswithlikes/Infantil"),
          await api.get('/metadata/series'),
          await api.get('/metadata/channels'),

        ])

        setChannelsTvAberta(channelsTvAbertaResponse.data);
        setChannelsFilmes(channelsFilmesResponse.data);
        setChannelsInfantil(channelsInfantilResponse.data);
        setMovies(moviesResponse.data.destaques);
        setSeries(seriesResponse.data.destaques);
        setTv(channelsResponse.data.destaques);
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
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextPrevArrow />,
    prevArrow: <SampleNextPrevArrow />,
    draggable: false,
    pauseOnFocus: false,
    pauseOnDotsHover: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
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
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (!movies || !series || !channelsTvAberta || !channelsFilmes || !channelsInfantil || !tvs) {
    return (
      <div className="absolute top-0 left-0 z-50 w-full h-screen bg-red-800 ">
        Carregando...
      </div>
    )
  }

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
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="absolute bottom-[70px] text-center mt-5 z-20">
          <h1 className="text-white text-2xl font-bold ">
            Confira o Top 10 filmes mais assistidos na Sventv
          </h1>
          <span className="text-sm">No SvenTv você tem conteúdo de cinema em casa.</span>
        </div>
        <div className="w-full h-full relative">
          <Slider {...carouselSettingsFilmes}>
            {movies.map((movie) => (
              <Movies
                key={movie.id}
                id={movie.id}
                runTime={movie.runTime}
                title={movie.title}
                rating={movie.rating}
                description={movie.description}
                assets={movie.assets}
              />
            ))
            }
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

      <div className="w-full h-auto flex flex-col items-center justify-center">
        <div className="text-center mt-5">
          <h1 className="text-white text-2xl font-bold ">
            Confira as séries mais assistidas no SvenTv
          </h1>
          <span className="text-sm">As melhores séries e desenhos em um só lugar.</span>
        </div>
        <div className="w-full h-full gap-5 px-16 py-8">
          <Slider {...carouselSettingsChannel}>
            {series.map((serie) => (
              <Series
                key={serie.id}
                id={serie.id}
                title={serie.title}
                rating={serie.rating}
                description={serie.description}
                assets={serie.assets}
              />
            ))
            }
          </Slider>
        </div>
      </div>

      <div className="w-full h-auto flex flex-col items-center justify-center">
        <div className="text-center mt-5">
          <h1 className="text-white text-2xl font-bold ">
            Confira a programação mais assistida neste momento no SvenTv
          </h1>
          <span className="text-sm">Fique por dentro dos programas, filmes, jogos mais assistidos nesse momento e assista você também!</span>
        </div>
        <div className="w-full h-full gap-5 px-16 py-8">
          <Slider {...carouselSettingsChannel}>
            {tvs.map((tv) => (
              <TvCard
                key={tv.id}
                id={tv.id}
                name={tv.name}
                description={tv.description}
                genre={tv.genre}
                channelName={tv.channelName}
                assets={tv.assets}
              />
            ))
            }
          </Slider>
        </div>
      </div>

    </div>
  );
}
