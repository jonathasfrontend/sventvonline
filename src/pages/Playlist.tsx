import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
// import { api } from "@/services/api";
// import { toast } from "react-toastify";
import { CaretRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

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

    // função para formatar a data de criação da playlist
    function formatDate(date: string) {
        const newDate = new Date(date);
        return newDate.toLocaleDateString();
    }

    // deleta uma playlist pelo id da playlist e do usuario
    // /deleteplaylist

    // deleta um canal de uma playlist pelo id do canal e da playlist
    // /deleteplaylistitem

    // lista o conteudo de uma playlist pelo id da playlist e do usuario e mostrando os canais com name description url e image
    // /playlist/:userId/:playlistId
    
    // lista a playlist de um usuario pelo id do usuario
    // /listplaylist/:userId

    // Função para excluir uma playlist do usuario verificando se tem conteudo dentro da propia playlist se tiver ele remove se não ele mostra uma mensagem de erro 

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="flex flex-col items-center justify-center pt-10">
                <h1 className="text-foreground text-4xl font-bold mt-10">Playlists</h1>
                <div className="flex items-end md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
                    {
                        // Renderiza a lista de favoritos se houver algum item na lista de favoritos mostra a mensagem "Nenhum canal favorito"
                        playlist.length > 0 ? (
                            playlist.map((item) => (
                                <Link to={`/playlist/${item.id}`} >
                                    <div key={item.id} className="w-full flex flex-col px-6 py-4 bg-gray-700 border border-gray-600 hover:brightness-125 transition rounded-md">
                                        <div className="w-full flex items-center justify-between">
                                            <h3 className="text-foreground font-semibold">{item.name}</h3>
                                            <CaretRight className='w-5 ml-5' />
                                        </div>
                                        <div className="w-full py-2">
                                            <h4 className="text-gray-500 text-xs font-medium">Criado em: {formatDate(item.created_at)}</h4>
                                        </div>
                                        <div className="w-full">
                                            <button
                                                className="text-foreground text-xs font-medium bg-red-500 px-2 py-1 rounded-sm"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </Link>
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