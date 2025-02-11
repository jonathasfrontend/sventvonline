import { useEffect, useState } from "react";
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
    try {

      // Verificar se os dados já estão no localStorage
      const storedMovies = localStorage.getItem("movies");
      const storedSeries = localStorage.getItem("series");

      if (storedMovies && storedSeries) {
        // Se os dados já estiverem armazenados, utilizamos eles
        setMovies(JSON.parse(storedMovies));
        setSeries(JSON.parse(storedSeries));
      } else {
        // Se não, fazemos a requisição
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
    } catch (error) {
      console.error('Error fetching highlights:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchHighlights() {
    setLoading(true);
    try {
      const storedTvAberta = localStorage.getItem("channelsTvAberta");

      const storedFilmes = localStorage.getItem("channelsFilmes");
      const storedNoticias = localStorage.getItem("channelsNoticias");
      const storedInfantil = localStorage.getItem("channelsInfantil");
      const storedVariedades = localStorage.getItem("channelsVariedades");
      const storedDocumentario = localStorage.getItem("channelsDocumentario");
      const storedEsportes = localStorage.getItem("channelsEsportes")

      if (storedVariedades && storedNoticias && storedDocumentario && storedEsportes && storedTvAberta && storedFilmes && storedInfantil) {
        setChannelsTvAberta(JSON.parse(storedTvAberta));
        setChannelsFilmes(JSON.parse(storedFilmes));
        setChannelsInfantil(JSON.parse(storedInfantil));
        setChannelsVariedades(JSON.parse(storedVariedades));
        setChannelsDocumentario(JSON.parse(storedDocumentario));
        setChannelsEsportes(JSON.parse(storedEsportes));
        setChannelsNoticias(JSON.parse(storedNoticias));
      } else {
        // Se não, fazemos a requisição
        const [
          channelsTvAbertaResponse,
          channelsNoticiasResponse,
          channelsFilmesResponse,
          channelsInfantilResponse,
          channelsVariedadesResponse,
          channelsDocumentarioResponse,
          channelsEsportesResponse,
        ] = await Promise.all([
          api.get("/liked/channelswithlikes/Tv Aberta"),
          api.get("/liked/channelswithlikes/Noticias"),
          api.get("/liked/channelswithlikes/Filmes"),
          api.get("/liked/channelswithlikes/Infantil"),
          api.get("/liked/channelswithlikes/Variedades"),
          api.get("/liked/channelswithlikes/Documentario"),
          api.get("/liked/channelswithlikes/Esportes"),
        ]);

        // Salvamos os dados no estado
        setChannelsTvAberta(channelsTvAbertaResponse.data);
        setChannelsNoticias(channelsNoticiasResponse.data);
        setChannelsFilmes(channelsFilmesResponse.data);
        setChannelsInfantil(channelsInfantilResponse.data);
        setChannelsVariedades(channelsVariedadesResponse.data);
        setChannelsDocumentario(channelsDocumentarioResponse.data);
        setChannelsEsportes(channelsEsportesResponse.data);

        // Armazenamos no localStorage
        localStorage.setItem("channelsTvAberta", JSON.stringify(channelsTvAbertaResponse.data));
        localStorage.setItem("channelsFilmes", JSON.stringify(channelsFilmesResponse.data));
        localStorage.setItem("channelsInfantil", JSON.stringify(channelsInfantilResponse.data));
        localStorage.setItem("channelsVariedades", JSON.stringify(channelsVariedadesResponse.data));
        localStorage.setItem("channelsDocumentario", JSON.stringify(channelsDocumentarioResponse.data));
        localStorage.setItem("channelsEsportes", JSON.stringify(channelsEsportesResponse.data));
        localStorage.setItem("channelsNoticias", JSON.stringify(channelsNoticiasResponse.data));

      }
    } catch (error) {
      console.error('Error fetching highlights:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      fetchHighlights();
      getMoviesSeries();
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
                  <h1 className="text-white text-2xl font-bold ">Nenhum filme encontrado</h1>
                </div>
              )
            }
          </Slider>
        </div>
      </div>

      <div className="w-full flex flex-col  items-center justify-center">
        <h1 className="text-white text-xl font-bold ">
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
                  <h1 className="text-white text-2xl font-bold ">Nenhum canal encontrado</h1>
                </div>
              )
            }
          </Slider>
        </div>
      </div>

      <div className="w-full flex flex-col  items-center justify-center">
        <h1 className="text-white text-xl font-bold ">
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
                  <h1 className="text-white text-2xl font-bold ">Nenhum canal encontrado</h1>
                </div>
              )
            }
          </Slider>
        </div>
      </div>

      <div className="w-full flex flex-col  items-center justify-center">
        <h1 className="text-white text-xl font-bold ">
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
                  <h1 className="text-white text-2xl font-bold ">Nenhum canal encontrado</h1>
                </div>
              )
            }
          </Slider>
        </div>
      </div>

      <div className="w-full flex flex-col  items-center justify-center">
        <h1 className="text-white text-xl font-bold ">
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
                  <h1 className="text-white text-2xl font-bold ">Nenhum canal encontrado</h1>
                </div>
              )
            }
          </Slider>
        </div>
      </div>

      <div className="w-full flex flex-col  items-center justify-center">
        <h1 className="text-white text-xl font-bold ">
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
                  <h1 className="text-white text-2xl font-bold ">Nenhum canal encontrado</h1>
                </div>
              )
            }
          </Slider>
        </div>
      </div>

      <div className="w-full flex flex-col  items-center justify-center">
        <h1 className="text-white text-xl font-bold ">
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
                  <h1 className="text-white text-2xl font-bold ">Nenhum canal encontrado</h1>
                </div>
              )
            }
          </Slider>
        </div>
      </div>

      <div className="w-full flex flex-col  items-center justify-center">
        <h1 className="text-white text-xl font-bold ">
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
                  <h1 className="text-white text-2xl font-bold ">Nenhum canal encontrado</h1>
                </div>
              )
            }
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
