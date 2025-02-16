import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { api } from '@/services/api';
import { Bounce, ToastContainer } from 'react-toastify';
import { AvatarCompenent } from '@/components/Avatar';
import Loading from '@/components/Loading';

interface ChannelData {
    playlistName: string,
    data: [
        {
            tv_channels: {
                id: string,
                url: string,
                name: string,
                image: string,
                categoria: string,
                created_at: string,
                description: string
            }
        }
    ]
}

export default function PlaylsitContent() {

    const { id } = useParams();
    const [playlistContent, setPlaylistContent] = useState<ChannelData | null>(null);

    const userId = localStorage.getItem("id_username");

    useEffect(() => {
        api.get(`/playlists/playlist/${userId}/${id}`)
            .then(response => {
                setPlaylistContent(response.data);
            })
            .catch(err => console.error(err));
    }, [id, userId]);

    // Renderiza um loading enquanto os dados não chegam
    if (!playlistContent) {
        return <Loading />;
    }

    return (
        <div className="h-full bg-background">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Bounce} />
            <Header />
            <div className="flex flex-col items-center justify-center py-10 px-16">
                <h1 className="text-foreground text-4xl font-bold mt-10">{playlistContent.playlistName}</h1>
                <div className="w-full grid grid-cols-3 gap-4 mt-10">
                    {
                        playlistContent.data.length > 0 ? (
                            playlistContent.data.map((item) => (
                                <div key={item.tv_channels.id} className="w-full flex flex-col px-6 py-4 bg-card border hover:bg-hover transition rounded-md">
                                    <a href={item.tv_channels.url} target="_blank" rel="noreferrer">
                                        <div className="w-full flex items-center justify-between">
                                            <h3 className="text-foreground font-semibold">{item.tv_channels.name}</h3>
                                        </div>
                                        <div className="w-full mt-3">
                                            <p className="text-foreground text-xs font-medium">{item.tv_channels.description}</p>
                                        </div>
                                        <div className="w-full mt-3">
                                            <AvatarCompenent nameUsers={item.tv_channels.name || ''} avatarUser={item.tv_channels.image || ''} size={35} />
                                        </div>
                                    </a>
                                </div>
                            ))
                        ) : (
                            <h2 className="text-slate-700 text-sm font-semibold">Nenhum canal nesta playlist</h2>
                        )
                    }
                </div>
            </div>
        </div>
    );
}