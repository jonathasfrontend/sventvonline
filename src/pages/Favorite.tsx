import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { toast } from "react-toastify";

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
            // Remove o canal do backend
            const response = await api.delete(`/favorite/unfavorite/${userId}/${channelId}`);

            if (response.status === 200) {
                // Atualiza o estado local
                const newFavorite = favorite.filter((item) => item.id !== channelId);
                setFavorite(newFavorite);

                // Atualiza o localStorage
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
        <div className="min-h-screen bg-[#121214]">
            <Header />
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-white text-4xl font-bold mt-10">Favoritos</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
                    {favorite.map((item) => (
                        <div key={item.id} className="bg-[#202024] rounded-lg p-4">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="w-full flex items-center justify-between">
                                <h2 className="text-white text-xl font-bold mt-4">{item.name}</h2>
                                <button
                                    className="px-2 py-2 mt-4 bg-red-500 rounded-md text-sm font-medium"
                                    onClick={() => handleRemoveFavorite(item.id)} // Passa o ID correto
                                >
                                    Remover
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}