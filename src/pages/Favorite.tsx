import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

interface FavoriteData {
    id: string;
    name: string;
    description: string;
    url: string;
    image: string;
    created_at: string;
}

export default function Favorite() {
    const [favorite, setFavorite] = useState<FavoriteData[]>([]);

    // Carregar favoritos do localStorage
    useEffect(() => {
        if (favorite.length > 0) return;
        const cachedPlaylists = localStorage.getItem("favorites");
        if (cachedPlaylists) setFavorite(JSON.parse(cachedPlaylists));
    }, []);

    // Função para remover um canal favorito
    const handleRemoveFavorite = async (channelId: string) => {
        const userId = localStorage.getItem("id_username");
        try {
            const response = await api.delete(`/favorite/unfavorite/${userId}/${channelId}`);

            if (response.status === 200) {
                const newFavorite = favorite.filter((item) => item.id !== channelId);
                setFavorite(newFavorite);
                localStorage.setItem("favorites", JSON.stringify(newFavorite));
                toast.success("Canal removido dos favoritos com sucesso!");
            } else {
                toast.error("Erro ao remover o canal dos favoritos.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro ao tentar se comunicar com a API.");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="flex flex-col items-center justify-center pt-10">
                <h1 className="text-foreground text-4xl font-bold mt-10">Favoritos</h1>
                <div className="flex items-end md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
                    {
                        favorite.length > 0 ? (
                            favorite.map((item) => (
                                <div className="w-full h-[130px] flex items-center">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-full" />

                                    <div className="w-full flex flex-col justify-center px-3">
                                        <h2 className="text-base font-medium">{item.name}</h2>
                                        <Link to={`/dashboard/${item.id}`} className="w-[140px] text-center text-sm font-semibold text-background px-5 py-2 mt-2 rounded-full bg-white hover:bg-slate-300">
                                            Acessar
                                        </Link>
                                        <button
                                            onClick={() => handleRemoveFavorite(item.id)}
                                            className="w-[140px] text-center text-sm font-semibold text-background px-5 py-2 mt-2 rounded-full bg-white hover:bg-red-400"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                    <Separator orientation="vertical" className="w-px bg-foreground " />
                                </div>
                            ))
                        ) : (
                            <div className="w-full flex items-center text-center">
                                <h2 className="text-gray-500 font-medium text-base">Você não tem nenhum canal favorito.</h2>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}