import { Heart, Star, BookmarkSimple } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "./ui/select";

interface Playlist {
  id: string;
  name: string;
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

export function CardChannel(props: CardChannelProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [idUsername, setIdUsername] = useState<string | null>(null);

  // Carrega dados do Local Storage
  useEffect(() => {
    const fetchData = async () => {
      const storedIdUsername = localStorage.getItem("id_username");
      if (storedIdUsername) setIdUsername(storedIdUsername);

      try {
        // Requisições paralelas para verificar favoritos e likes
        const [favoritesRes, likedRes] = await Promise.all([
          api.get(`/favorite/favorites/${storedIdUsername}`),
          api.get("/liked/channelswithlikes"),
        ]);

        const likedData = likedRes.data.map(({ id }: any) => id);
        const favoritesData = favoritesRes.data.map(
          ({ tv_channels: { id } }: any) => id
        );
        
        localStorage.setItem("favorite_channels", JSON.stringify(favoritesData));
        localStorage.setItem("liked_channels", JSON.stringify(likedData));

        setIsFavorite(favoritesData.includes(props.id));
        setIsLiked(likedData.includes(props.id));
      } catch (error: any) {
        toast.error(
          error.response?.data?.error || "Erro ao carregar os dados."
        );
      }
    };

    fetchData();
  }, [props.id]);

  useEffect(() => {
    const cachedPlaylists = localStorage.getItem("playlists");
    if (cachedPlaylists) setPlaylists(JSON.parse(cachedPlaylists));
  }, []);

  // Função para salvar dados no Local Storage
  const updateLocalStorage = (key: string, value: any[]) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const handleLike = async () => {
    const likedChannels = JSON.parse(localStorage.getItem("liked_channels") || "[]");

    if (isLiked) {
      toast.error("Você já curtiu este canal");
      return;
    }

    try {
      await api.post(`/liked/like/${idUsername}/${props.id}`);
      setIsLiked(true);
      likedChannels.push(props.id);
      updateLocalStorage("liked_channels", likedChannels);
    } catch (error: any) {
      toast.error(error.response?.data?.error);
    }
  };

  const handleAddToFavorites = async () => {
    const favoriteChannels = JSON.parse(localStorage.getItem("favorite_channels") || "[]");

    if (isFavorite) {
      toast.error("Você já favoritou este canal");
      return;
    }

    try {
      await api.post("/favorite/favorites", {
        channelId: props.id,
        userId: `${idUsername}`,
      });
      setIsFavorite(true);
      favoriteChannels.push(props.id);
      updateLocalStorage("favorite_channels", favoriteChannels);
    } catch (error: any) {
      toast.error(error.response?.data?.error);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      await api.post("/playlists/addplaylist", {
        channelId: props.id,
        playlistId,
      });
      toast.success("Canal adicionado à playlist!");
    } catch (error: any) {
      toast.error(error.response?.data?.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-[#323262] text-white rounded-md shadow-md w-[330px] relative">

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

      <div className="w-full flex">
        <img src={props.image} alt={props.name} className="w-28 h-28 rounded-full" />

        <div className="w-full flex flex-col justify-center ml-5">
          <h2 className="text-xl font-bold">{props.name}</h2>
          <p className="text-xs text-gray-300 mb-1">{props.description}</p>
          <div className="w-full flex items-center justify-between">
            <button onClick={handleLike} className="hover:text-red-400">
              {isLiked ? (
                <Heart size={24} weight="fill" className="text-red-400" />
              ) : (
                <Heart size={24} weight="regular" />
              )}
            </button>
            <button onClick={handleAddToFavorites} className="hover:text-yellow-400">
              {isFavorite ? (
                <Star size={24} weight="fill" className="text-yellow-400" />
              ) : (
                <Star size={24} weight="regular" />
              )}
            </button>

            <Select>
              <SelectTrigger className="w-auto">
                <BookmarkSimple size={24} weight="regular" className="hover:text-green-400" />
              </SelectTrigger>
              <SelectContent>
                {playlists.length > 0 ? (
                  playlists.map((playlist) => (
                    <SelectItem
                      key={playlist.id}
                      value={playlist.id}
                      onClick={() => handleAddToPlaylist(playlist.id)}
                    >
                      {playlist.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    <span className="text-gray-400 px-4">Nenhuma playlist</span>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <Link to={props.id} className="w-[100px] text-center text-sm font-medium text-[#323262] px-5 py-2 mt-2 rounded-full bg-white">
            Acessar
          </Link>
        </div>
      </div>

      <div className="w-full absolute left-[220px] top-2 text-xs text-gray-400 flex items-center">
        {props.likedBy.slice(0, 3).map((user) => (
          <img
            key={user.user_id}
            src={user.user_avatar}
            alt={user.user_name}
            className="w-6 h-6 rounded-full -ml-3 border-[3px] border-[#323262]"
          />
        ))}
        <div className="w-full text-xs text-gray-400 flex items-center">
          <span className="text-sm">
            {props.likeCount > 0
              ? props.likeCount > 1
                ? `${props.likeCount} curtidas`
                : `${props.likeCount} curtida`
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
