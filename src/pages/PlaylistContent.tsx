import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { api } from '@/services/api';
import { Bounce, ToastContainer } from 'react-toastify';
import { AvatarCompenent } from '@/components/Avatar';
import Loading from '@/components/Loading';

type ChannelData = {
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

    if (!playlistContent) {
        return <Loading />;
    }

    return (
        <div className="h-full bg-background">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Bounce} />
            <Header />
            <div className="flex flex-col items-center justify-center py-10 px-16">
                <h1 className="text-foreground text-4xl font-bold mt-10">
                    {playlistContent.playlistName}
                </h1>
                <div className="w-full grid grid-cols-4 gap-4 mt-10">
                    {
                        playlistContent.data.map((channel) => (
                            <div key={channel.tv_channels.id} className="w-full flex flex-col px-6 py-4 bg-card border hover:bg-hover transition rounded-md">
                                <Link to={`/${channel.tv_channels.id}`} >
                                    <div className="w-full gap-3 flex items-center">
                                        <AvatarCompenent
                                            avatarUser={channel.tv_channels.image}
                                            nameUsers={channel.tv_channels.name}
                                            size={48}
                                        />
                                        <h3 className="text-foreground font-semibold">{channel.tv_channels.name}</h3>
                                    </div>
                                </Link>
                                <button
                                    className="text-foreground mt-3 text-xs font-medium bg-red-500 px-2 py-1 rounded-sm"
                                >
                                    Excluir
                                </button>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}