import { Heart, Star, BookmarkSimple } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";
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

  useEffect(() => {
    const storedIdUsername = localStorage.getItem("id_username");
    if (storedIdUsername) setIdUsername(storedIdUsername);

    setIsLiked(
      props.likedBy.some((user: { user_id: string }) => user.user_id === idUsername)
    );
    setIsFavorite(
      props.likedBy.some((user: { user_id: string }) => user.user_id === idUsername)
    );
  }, [props.likedBy, idUsername]);

  useEffect(() => {
    if (playlists.length > 0) return;
    const cachedPlaylists = localStorage.getItem("playlists");
    if (cachedPlaylists) setPlaylists(JSON.parse(cachedPlaylists));
  }, []);

  const handleLike = async () => {
    if (isLiked) {
      toast.error("Você já curtiu este canal");
      return;
    }
    setIsLiked(true);
    try {
      await api.post(`/liked/like/${idUsername}/${props.id}`);
    } catch (error: any) {
      setIsLiked(false);
      toast.error(error.response?.data?.error || "Erro ao curtir o canal");
    }
  };

  const handleAddToFavorites = async () => {
    if (isFavorite) {
      toast.error("Você já favoritou este canal");
      return;
    }
    setIsFavorite(true);
    try {
      await api.post("/favorite/favorites", {
        channelId: props.id,
        userId: `${idUsername}`,
      });
    } catch (error: any) {
      setIsFavorite(false);
      toast.error(error.response?.data?.error);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      await api.post("/playlists/addplaylist", {
        channelId: props.id,
        playlistId,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-[#323262] text-white rounded-md shadow-md w-[330px] relative">
      <div className="w-full flex ">
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
        </div>
      </div>

      <div className="w-full absolute left-[220px] top-2 text-xs text-gray-400 flex items-center">
        {
          props.likedBy.slice(0, 3).map((user) => (
            <img
              key={user.user_id}
              src={user.user_avatar}
              alt={user.user_name}
              className="w-6 h-6 rounded-full -ml-3 border-[3px] border-[#323262]"
            />
          ))
        }
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
