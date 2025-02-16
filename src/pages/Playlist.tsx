import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { CaretRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import { Bounce, toast, ToastContainer } from "react-toastify";

interface PlaylistData {
    id: string;
    name: string;
    description: string;
    created_at: string;
}

export default function Playlist() {
    const [playlist, setPlaylist] = useState<PlaylistData[]>([]);

    // Carregar favoritos do localStorage
    useEffect(() => {
        if (playlist.length > 0) return;
        const cachedPlaylists = localStorage.getItem("playlists");
        if (cachedPlaylists) setPlaylist(JSON.parse(cachedPlaylists));
    }, []);

    async function deletePlaylist(id: string) {
        try {
            await api.delete(`/playlists/deleteplaylist`, {
                data: { playlistId: id, userId: localStorage.getItem("id_username") }
            });
            const newPlaylists = playlist.filter((item) => item.id !== id);
            setPlaylist(newPlaylists);
            localStorage.setItem("playlists", JSON.stringify(newPlaylists));
            toast.success("Playlist deletada com sucesso!");
        } catch (error: any) {
            toast.error(error.response.data.error);
        }
    }

    return (
        <div className="h-full bg-background">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Bounce} />
            <Header />
            <div className="flex flex-col items-center justify-center py-10 px-16">
                <h1 className="text-foreground text-4xl font-bold mt-10">Playlists</h1>
                <div className="w-full flex flex-col gap-4 mt-10">
                    {
                        // Renderiza a lista de favoritos se houver algum item na lista de favoritos mostra a mensagem "Nenhum canal favorito"
                        playlist.length > 0 ? (
                            playlist.map((item) => (
                                <div key={item.id} className="w-full flex flex-col px-6 py-4 bg-card border hover:bg-hover transition rounded-md">
                                    <Link to={`/playlist/${item.id}`} >
                                        <div className="w-full flex items-center justify-between">
                                            <h3 className="text-foreground font-semibold">{item.name}</h3>
                                            <CaretRight className='w-5 ml-5 text-foreground' />
                                        </div>
                                    </Link>
                                    <div className="w-full mt-3">
                                        <button
                                            onClick={() => deletePlaylist(item.id)}
                                            className="text-foreground text-xs font-medium bg-red-500 px-2 py-1 rounded-sm"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="w-full flex items-center text-center">
                                <h2 className="text-gray-500 font-medium text-base">Você não tem nenhuma playlist.</h2>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}