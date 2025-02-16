import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Header } from "../components/Header";
import { CardChannel } from "../components/CardChannel";
import { Bounce, ToastContainer } from "react-toastify";
import Movies from "@/components/MovieCard";
import Slider from "react-slick";
import SampleNextPrevArrow from "@/components/SampleNextPrevArrow";
import Series from "@/components/SerieCard";
import Loading from "@/components/Loading";

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
  const [channelsTvAberta, setChannelsTvAberta] = useState<any[]>([]);
  const [channelsFilmes, setChannelsFilmes] = useState<any[]>([]);
  const [channelsInfantil, setChannelsInfantil] = useState<any[]>([]);
  const [channelsVariedades, setChannelsVariedades] = useState<any[]>([]);
  const [channelsDocumentario, setChannelsDocumentario] = useState<any[]>([]);
  const [channelsEsportes, setChannelsEsportes] = useState<any[]>([]);
  const [channelsNoticias, setChannelsNoticias] = useState<any[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);

  async function getMoviesSeries() {
    const storedMovies = localStorage.getItem("movies");
    const storedSeries = localStorage.getItem("series");

    if (storedMovies && storedSeries) {
      setMovies(JSON.parse(storedMovies));
      setSeries(JSON.parse(storedSeries));
    } else {
      const [
        moviesResponse,
        seriesResponse,
      ] = await Promise.all([
        api.get('/metadata/movies'),
        api.get('/metadata/series'),
      ]);

      setMovies(moviesResponse.data.destaques);
      setSeries(seriesResponse.data.destaques);
      localStorage.setItem("movies", JSON.stringify(moviesResponse.data.destaques));
      localStorage.setItem("series", JSON.stringify(seriesResponse.data.destaques));
    }
  }

  async function getTvAberta() {
    const storedTvAberta = localStorage.getItem("channelsTvAberta");
    if (storedTvAberta) {
      setChannelsTvAberta(JSON.parse(storedTvAberta));
    } else {
      const response = await api.get("/liked/channelswithlikes/Tv Aberta");
      setChannelsTvAberta(response.data);
      localStorage.setItem("channelsTvAberta", JSON.stringify(response.data));

    }
  };

  async function getChannelNoticias() {
    const storedNoticias = localStorage.getItem("channelsNoticias");
    if (storedNoticias) {
      setChannelsNoticias(JSON.parse(storedNoticias));
    } else {
      const response = await api.get("/liked/channelswithlikes/Noticias");
      setChannelsNoticias(response.data);
      localStorage.setItem("channelsNoticias", JSON.stringify(response.data));
    }
  }

  async function getChannelFilmes() {
    const storedFilmes = localStorage.getItem("channelsFilmes");
    if (storedFilmes) {
      setChannelsFilmes(JSON.parse(storedFilmes));
    } else {
      const response = await api.get("/liked/channelswithlikes/Filmes");
      setChannelsFilmes(response.data);
      localStorage.setItem("channelsFilmes", JSON.stringify(response.data));
    }
  }

  async function getChannelInfantil() {
    const storedInfantil = localStorage.getItem("channelsInfantil");
    if (storedInfantil) {
      setChannelsInfantil(JSON.parse(storedInfantil));
    } else {
      const response = await api.get("/liked/channelswithlikes/Infantil");
      setChannelsInfantil(response.data);
      localStorage.setItem("channelsInfantil", JSON.stringify(response.data));
    }
  }

  async function getChannelVariedades() {
    const storedVariedades = localStorage.getItem("channelsVariedades");
    if (storedVariedades) {
      setChannelsVariedades(JSON.parse(storedVariedades));
    } else {
      const response = await api.get("/liked/channelswithlikes/Variedades");
      setChannelsVariedades(response.data);
      localStorage.setItem("channelsVariedades", JSON.stringify(response.data));
    }
  }

  async function getChannelDocumentario() {
    const storedDocumentario = localStorage.getItem("channelsDocumentario");
    if (storedDocumentario) {
      setChannelsDocumentario(JSON.parse(storedDocumentario));
    } else {
      const response = await api.get("/liked/channelswithlikes/Documentario");
      setChannelsDocumentario(response.data);
      localStorage.setItem("channelsDocumentario", JSON.stringify(response.data));
    }
  }

  async function getChannelEsportes() {
    const storedEsportes = localStorage.getItem("channelsEsportes");
    if (storedEsportes) {
      setChannelsEsportes(JSON.parse(storedEsportes));
    } else {
      const response = await api.get("/liked/channelswithlikes/Esportes");
      setChannelsEsportes(response.data);
      localStorage.setItem("channelsEsportes", JSON.stringify(response.data));
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(true);
      try {
        getMoviesSeries();
        getTvAberta();
        getChannelFilmes();
        getChannelNoticias();
        getChannelInfantil();
        getChannelVariedades();
        getChannelDocumentario();
        getChannelEsportes();
      } catch (error) {
        console.error('Error fetching highlights:', error);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
    return <Loading />;
  }

  return (
    <div className="h-full bg-background">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Bounce} />

      <Header />

      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="absolute bottom-[70px] text-center mt-5 z-20">
          <span className="text-sm text-gray-500 font-medium">No SvenTv você tem conteúdo de cinema em casa.</span>
          <h1 className="text-foreground font-semibold text-xl">
            Confira o Top 10 filmes mais assistidos na Sventv
          </h1>
        </div>
        <div className="w-full h-full relative">
          <Slider {...carouselSettingsFilmes}>
            {
              movies.length > 0 ? (
                movies.map((movie) => (
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
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <h1 className="text-gray-500 font-medium text-base">Nenhum filme encontrado</h1>
                </div>
              )
            }
          </Slider>
        </div>
      </div>

      <div className="w-full flex flex-col  items-center justify-center">
        <h1 className="text-foreground text-xl font-bold ">
          Tv Aberta
        </h1>
        <div className="w-full gap-5 px-16 py-8">
          <Slider {...carouselSettingsChannel}>
            {
              channelsTvAberta.length > 0 ? (
                channelsTvAberta.map((channel) => (
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
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <h1 className="text-gray-500 font-medium text-base">Nenhum canal encontrado</h1>
                </div>
              )
            }
          </Slider>
        </div>
      </div>

      <div className="w-full flex flex-col  items-center justify-center">
        <h1 className="text-foreground text-xl font-bold ">
          Noticias
        </h1>
        <div className="w-full gap-5 px-16 py-8">
          <Slider {...carouselSettingsChannel}>
            {
              channelsNoticias.length > 0 ? (
                channelsNoticias.map((channel) => (
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
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <h1 className="text-gray-500 font-medium text-base">Nenhum canal encontrado</h1>
                </div>
              )
            }
          </Slider>
        </div>
      </div>

      <div className="w-full flex flex-col  items-center justify-center">
        <h1 className="text-foreground text-xl font-bold ">
          Filmes
        </h1>
        <div className="w-full gap-5 px-16 py-8">
          <Slider {...carouselSettingsChannel}>
            {
              channelsFilmes.length > 0 ? (
                channelsFilmes.map((channel) => (
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
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <h1 className="text-gray-500 font-medium text-base">Nenhum canal encontrado</h1>
                </div>
              )
            }
          </Slider>
        </div>
      </div>

      <div className="w-full flex flex-col  items-center justify-center">
        <h1 className="text-foreground text-xl font-bold ">
          Infantil
        </h1>
        <div className="w-full gap-5 px-16 py-8">
          <Slider {...carouselSettingsChannel}>
            {
              channelsInfantil.length > 0 ? (
                channelsInfantil.map((channel) => (
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
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <h1 className="text-gray-500 font-medium text-base">Nenhum canal encontrado</h1>
                </div>
              )
            }
          </Slider>
        </div>
      </div>

      <div className="w-full flex flex-col  items-center justify-center">
        <h1 className="text-foreground text-xl font-bold ">
          Variedades
        </h1>
        <div className="w-full gap-5 px-16 py-8">
          <Slider {...carouselSettingsChannel}>
            {
              channelsVariedades.length > 0 ? (
                channelsVariedades.map((channel) => (
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
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <h1 className="text-gray-500 font-medium text-base">Nenhum canal encontrado</h1>
                </div>
              )
            }
          </Slider>
        </div>
      </div>

      <div className="w-full flex flex-col  items-center justify-center">
        <h1 className="text-foreground text-xl font-bold ">
          Documentário
        </h1>
        <div className="w-full gap-5 px-16 py-8">
          <Slider {...carouselSettingsChannel}>
            {
              channelsDocumentario.length > 0 ? (
                channelsDocumentario.map((channel) => (
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
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <h1 className="text-gray-500 font-medium text-base">Nenhum canal encontrado</h1>
                </div>
              )
            }
          </Slider>
        </div>
      </div>

      <div className="w-full flex flex-col  items-center justify-center">
        <h1 className="text-foreground text-xl font-bold ">
          Esportes
        </h1>
        <div className="w-full gap-5 px-16 py-8">
          <Slider {...carouselSettingsChannel}>
            {
              channelsEsportes.length > 0 ? (
                channelsEsportes.map((channel) => (
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
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <h1 className="text-gray-500 font-medium text-base">Nenhum canal encontrado</h1>
                </div>
              )
            }
          </Slider>
        </div>
      </div>

      <div className="w-full h-auto flex flex-col items-center justify-center">
        <div className="text-center mt-5">
          <h1 className="text-foreground font-semibold text-xl">
            Confira as séries mais assistidas no SvenTv
          </h1>
          <span className="text-sm text-gray-500 font-medium">As melhores séries e desenhos em um só lugar.</span>
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
