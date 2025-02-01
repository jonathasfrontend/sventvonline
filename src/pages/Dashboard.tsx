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
import logoSolo from '../img/white_logo_solo_vazado.png';

interface Movie {
  id: string;
  title: string;
  rating: {
    description: string;
  },
  runTime: string;
  description: {
    short: string;
  },
  assets: [
    {
      ratio: string;
      url: string;
      category: string;
    }
  ]
}

interface Serie {
  id: string,
  title: string,
  rating: {
    description: string,
  },
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [channelsTvAberta, setChannelsTvAberta] = useState<any[]>([]);
  const [channelsFilmes, setChannelsFilmes] = useState<any[]>([]);
  const [channelsInfantil, setChannelsInfantil] = useState<any[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      setLoading(true);
      try {
        // Verificar se os dados já estão no localStorage
        const storedMovies = localStorage.getItem("movies");
        const storedSeries = localStorage.getItem("series");
        const storedTvAberta = localStorage.getItem("channelsTvAberta");
        const storedFilmes = localStorage.getItem("channelsFilmes");
        const storedInfantil = localStorage.getItem("channelsInfantil");

        if (storedMovies && storedSeries && storedTvAberta && storedFilmes && storedInfantil) {
          // Se os dados já estiverem armazenados, utilizamos eles
          setMovies(JSON.parse(storedMovies));
          setSeries(JSON.parse(storedSeries));
          setChannelsTvAberta(JSON.parse(storedTvAberta));
          setChannelsFilmes(JSON.parse(storedFilmes));
          setChannelsInfantil(JSON.parse(storedInfantil));
        } else {
          // Se não, fazemos a requisição
          const [
            moviesResponse,
            channelsTvAbertaResponse,
            channelsFilmesResponse,
            channelsInfantilResponse,
            seriesResponse,
          ] = await Promise.all([
            api.get('/metadata/movies'),
            api.get("/liked/channelswithlikes/Tv Aberta"),
            api.get("/liked/channelswithlikes/Filmes"),
            api.get("/liked/channelswithlikes/Infantil"),
            api.get('/metadata/series'),
          ]);

          // Salvamos os dados no estado
          setMovies(moviesResponse.data.destaques);
          setSeries(seriesResponse.data.destaques);
          setChannelsTvAberta(channelsTvAbertaResponse.data);
          setChannelsFilmes(channelsFilmesResponse.data);
          setChannelsInfantil(channelsInfantilResponse.data);

          // Armazenamos no localStorage
          localStorage.setItem("movies", JSON.stringify(moviesResponse.data.destaques));
          localStorage.setItem("series", JSON.stringify(seriesResponse.data.destaques));
          localStorage.setItem("channelsTvAberta", JSON.stringify(channelsTvAbertaResponse.data));
          localStorage.setItem("channelsFilmes", JSON.stringify(channelsFilmesResponse.data));
          localStorage.setItem("channelsInfantil", JSON.stringify(channelsInfantilResponse.data));
        }
      } catch (error) {
        console.error('Error fetching highlights:', error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="absolute top-0 left-0 z-50 w-full h-screen bg-[#121214] flex items-center justify-center">
        <img src={logoSolo} className="w-16 animate-bounce " alt="" />
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
    </div>
  );
}
