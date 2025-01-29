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
import { CircleNotch } from "@phosphor-icons/react";
// import TvCard from "@/components/TvCard";

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

interface CardChannelProps {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string;
  likeCount: number;
  likedBy: {
    user_id: string;
    user_name: string;
    user_avatar: string;
  }[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    channelsTvAberta: [],
    channelsFilmes: [],
    channelsInfantil: [],
    movies: [],
    series: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          '/metadata/movies',
          '/liked/channelswithlikes/Tv Aberta',
          '/liked/channelswithlikes/Filmes',
          '/liked/channelswithlikes/Infantil',
          '/metadata/series',
        ];

        const responses = await Promise.all(endpoints.map(endpoint => api.get(endpoint)));

        setData({
          movies: responses[0].data.destaques,
          channelsTvAberta: responses[1].data,
          channelsFilmes: responses[2].data,
          channelsInfantil: responses[3].data,
          series: responses[4].data.destaques,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (loading) {
    return (
      <div className="absolute top-0 left-0 z-50 w-full h-screen bg-[#121214] flex items-center justify-center">
        <CircleNotch size={32} className="animate-spin" />
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
            {data.movies.map((movie: Movie) => (
              <Movies key={movie.id} {...movie} />
            ))
            }
          </Slider>
        </div>
      </div>



      {[{ title: "Tv Aberta", channels: data.channelsTvAberta }, { title: "Filmes", channels: data.channelsFilmes }, { title: "Infantil", channels: data.channelsInfantil }].map((section, index) => (
        <div key={index} className="w-full flex flex-col items-center justify-center">
          <h1 className="text-white text-xl font-bold">{section.title}</h1>
          <Slider {...carouselSettingsChannel}>
            {data.channelsInfantil.map((channel: CardChannelProps) =>
              <CardChannel key={channel.id} {...channel} />
            )}
          </Slider>
        </div>
      ))}

      <div className="w-full h-auto flex flex-col items-center justify-center">
        <div className="text-center mt-5">
          <h1 className="text-white text-2xl font-bold ">
            Confira as séries mais assistidas no SvenTv
          </h1>
          <span className="text-sm">As melhores séries e desenhos em um só lugar.</span>
        </div>
        <div className="w-full h-full gap-5 px-16 py-8">
          <Slider {...carouselSettingsChannel}>
            {data.series.map((serie: Serie) => (
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
